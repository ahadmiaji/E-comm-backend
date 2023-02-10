const cloudinary = require("cloudinary"); //https://www.youtube.com/watch?v=S6Yd5cPtXr4&list=PL0g02APOH8olUaSJUReizC6KQXTrGYNU6 cloudinary segment 6.36hr/min importent why it use at utils ?


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET_KEY,
});


const cloudinaryUploadingImg = async (fileToUploads) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUploads, (result) => {
            resolve({
                url: result.secure_url,
            },
                {
                    resource_type: "auto",
                });
        });
    });
};

module.exports = cloudinaryUploadingImg;


//https://www.youtube.com/watch?v=S6Yd5cPtXr4&list=PL0g02APOH8olUaSJUReizC6KQXTrGYNU6  timestamps 6.55hr/min

