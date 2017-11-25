const Storage = require('@google-cloud/storage');
const request = require('request');
const iconv = require('iconv-lite');

const url = 'https://ckan.open-governmentdata.org/dataset/ef0a812c-538b-4e54-ae3e-b22022a7c83a/resource/c60ccc29-811d-44f8-9aba-dcb660387927/download/kankyodata48.csv';
const bucketname = '[Your Bucket Name]';
const filename = 'kankyo.csv';

exports.downloadfile = function(event, callback) {
    const options = {
        method  : 'GET',
        url     : url,
        encoding: null
    };
    request(options, (error, response, body) => {
        if (!error) {
            if (response.statusCode === 200) {
                const buffer = iconv.decode(body, 'Shift_JIS');
                const storage = new Storage();
                const stream = storage.bucket(bucketname).file(filename).createWriteStream();
                stream.end(buffer);
                stream.on('finish', () => {
                    console.log('Success');
                    callback();
                });
                stream.on('error', (err) => {
                    console.log('File Write Error');
                    callback();
                });
            } else {
                console.log('Download Error: ' + response.statusCode);
                callback();
            }
        } else {
            console.log('Error');
            callback();
        }
    });
};
