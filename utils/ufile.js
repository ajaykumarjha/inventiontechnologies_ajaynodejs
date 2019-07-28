const configs = require('../config/dconfig');
var fs = require('fs');
var aws = require('aws-sdk');

aws.config.update({
    secretAccessKey:configs.awsConfig.secretAccessKey,
    accessKeyId: configs.awsConfig.accessKeyId,
    region: configs.awsConfig.region,
});

var s3 = new aws.S3();
var baseUrl=configs.awsConfig.baseUrl;
var bucketName=configs.awsConfig.bucketName;
module.exports = {
    uploadFileToS3(filePath) {
        return new Promise(function (resolve, reject) {
            console.log(filePath)
            const f =filePath; 
            var path = f.path;
            var timestamp=Date.now()
            fs.readFile(path, function(err, file_buffer){
                var params = {
                    Bucket: configs.awsConfig.bucketName,
                    Key: timestamp+f.filename,
                    Body: file_buffer,
                    ACL:'public-read'
                };
                s3.putObject(params, function (perr, pres) {
                    if (perr) {
                        console.log("Error uploading data: ", perr);
                    } 
                    else {
                        console.log("sdfghj")
                        resolve({
                            url:baseUrl+bucketName+"/"+timestamp+f.filename,
                            publicId:timestamp+f.filename,
                            filename:f.filename
                        });
                    }
                });
            });
        });
    },
    deleteFileFromS3(publicId) {
        return new Promise(function (resolve, reject) {
            var data1=publicId
            console.log(data1)
            var params = {
                Bucket: configs.awsConfig.bucketName,
                Delete: {
                    Objects: [
                    {
                      Key: data1
                    }],
                },
            };
            s3.deleteObjects(params, function(err, data) {
                if (err){
                    console.log('err'+err)
                }
                else  {
                    console.log('deleted'+JSON.stringify(data))
                    resolve({message:'File deleted sucessfully from aws'});
                }
            });
        });
    }
};