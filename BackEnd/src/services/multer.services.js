import multer from "multer";


// here we write the multer middleware to upload file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname);
    },
  });
  
  //here we define the storage in multer
 export const upload = multer({ storage: storage });