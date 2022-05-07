import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { FileUpload } from 'graphql-upload';

// 파일을 타입스크립트에서 읽기위해서 인터페이스 제작

interface IFiles {
    files: FileUpload[];
}

@Injectable()
export class FileService {
    async upload({ files }: IFiles) {
        const storage = new Storage({
            keyFilename: process.env.STORAGE_KEY_FILE,
            projectId: process.env.STORAGE_PROJECT_ID,
        }).bucket(process.env.STORAGE_BUCKET);

        const waitedFiles = await Promise.all(files);

        const results = await Promise.all(
            waitedFiles.map((e) => {
                return new Promise((resolve, reject) => {
                    e.createReadStream()
                        .pipe(
                            storage
                                .file(e.filename)
                                .createWriteStream({ resumable: false }),
                        )
                        .on('finish', () =>
                            resolve(
                                `${process.env.STORAGE_BUCKET}/${e.filename}`,
                            ),
                        )
                        .on('error', (error) =>
                            reject(`upload failure.....🧐 : ${error}`),
                        );
                });
            }),
        );
        return results;
    }

    async delete({ files }: IFiles) {
        const storage = new Storage({
            keyFilename: process.env.STORAGE_KEY_FILE,
            projectId: process.env.STORAGE_PROJECT_ID,
        }).bucket(process.env.STORAGE_BUCKET);

        files.forEach((e) => {
            storage.file(String(e)).delete();
        });

        return;
    }

    // delete() {
    //     //  * TODO(developer): Uncomment the following lines before running the sample.
    //     // Creates a client
    //     const storage = new Storage();
    //     async function deleteFile() {
    //         await storage
    //             .bucket(process.env.STORAGE_BUCKET)
    //             .file(process.env.STORAGE_KEY_FILE)
    //             .delete();
    //         console.log(
    //             `gs://${process.env.STORAGE_BUCKET}/${process.env.STORAGE_KEY_FILE} deleted`,
    //         );
    //     }
    //     deleteFile().catch(console.error);
    // }
}

// 여러파일을 동시에 업로드하려면 어떻게 해야할까?
// for문 : 순서가 정해지고 먼저 업로드하는게 완료되지 않을 경우 뒤 순서도 무한대기
// https://storage.googleapis.com/codecamp_file_storage/
// GCP 내부 함수를 통해 섬네일 트리거와 같이 작업을 GCP에서 처리할 수 있다
// => CloudFunction
