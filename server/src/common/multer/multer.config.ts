// import { diskStorage } from 'multer';
// import { extname } from 'path';

// export const multerOptions = {
//   storage: diskStorage({
//     destination: './uploads',

//     filename: (req, file, cb) => {
//       const extension = extname(file.originalname);

//       const filename = `${Date.now()}-${Math.round(Math.random() * 10000)}${extension}`;

//       cb(null, filename);
//     },
//   }),
// };
