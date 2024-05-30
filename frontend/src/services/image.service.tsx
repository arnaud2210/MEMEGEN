// import { Buffer } from 'buffer';
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { Storage } from '@google-cloud/storage';


// const storage = new Storage({ keyFilename: 'key.json' }
//     // {
//     //     projectId: import.meta.env.VITE_PROJECT_ID,
//     //     credentials: {
//     //         client_email: import.meta.env.VITE_CLIENT_EMAIL,
//     //         private_key: import.meta.env.VITE_PRIVATE_KEY,
//     //     },
//     // }
// )

// export const getImageAsBlob = async (bucketName: string, fileName: string) => {
//     try {
//         // Récupérer le fichier depuis GCS
//         const file = storage.bucket(bucketName).file(fileName);

//         // Télécharger le contenu du fichier en tant que Buffer
//         const [data] = await file.download();

//         // Convertir le Buffer en blob
//         const blob = Buffer.from(data).toString('base64');

//         return blob;
//     } catch (error) {
//         console.error('Erreur lors de la récupération du fichier :', error);
//         throw error;
//     }
// }