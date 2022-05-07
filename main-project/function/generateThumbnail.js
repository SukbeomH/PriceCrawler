const { Storage } = require("@google-cloud/storage");
const sharp = require("sharp");

exports.helloGCS = async (event, context) => {
	const storage = new Storage().bucket();
	const promises = [];

	if (event.name.includes("thumb/")) return;

	promises.push(
		storage
			.file(event.name)
			.createReadStream()
			.pipe(sharp().resize({ width: 320 }))
			.pipe(
				storage
					.file(`thumb/s${event.name}`)
					.createWriteStream()
			)
			.on("finish", () => resolve())
			.on("error", (err) => rejects(err))
	);
	promises.push(
		storage
			.file(event.name)
			.createReadStream()
			.pipe(sharp().resize({ width: 640 }))
			.pipe(
				storage
					.file(`thumb/m${event.name}`)
					.createWriteStream()
			)
			.on("finish", () => resolve())
			.on("error", (err) => rejects(err))
	);
	promises.push(
		storage
			.file(event.name)
			.createReadStream()
			.pipe(sharp().resize({ width: 1280 }))
			.pipe(
				storage
					.file(`thumb/l${event.name}`)
					.createWriteStream()
			)
			.on("finish", () => resolve())
			.on("error", (err) => rejects(err))
	);

	const results = await Promise.all(promises);
	return results;
};

// exports.generateThumbnail = functions.storage
// 	.object()
// 	.onFinalize(async (object) => {
// 		const fileBucket = object.bucket; // The Storage bucket that contains the file.
// 		const filePath = object.name; // File path in the bucket.
// 		const contentType = object.contentType; // File content type.
// 		const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

// 		// Exit if this is triggered on a file that is not an image.
// 		if (!contentType.startsWith("image/")) {
// 			return functions.logger.log("This is not an image.");
// 		}
// 		// Get the file name.
// 		const fileName = path.basename(filePath);
// 		// Exit if the image is already a thumbnail.
// 		if (fileName.startsWith("thumb_")) {
// 			return functions.logger.log("Already a Thumbnail.");
// 		}
// 		// imports
// 		const functions = require("firebase-functions");
// 		const admin = require("firebase-admin");
// 		const { sharp } = require("sharp");
// 		admin.initializeApp();
// 		const spawn = require("child-process-promise").spawn;
// 		const path = require("path");
// 		const os = require("os");
// 		const fs = require("fs");
// 		const got = require("got");
// 		const sharpStream = sharp({
// 			failOnError: false,
// 		});

// 		// Download file from bucket.
// 		const bucket = admin.storage().bucket(fileBucket);
// 		const tempFilePath = path.join(os.tmpdir(), fileName);
// 		const metadata = {
// 			contentType: contentType,
// 		};
// 		await bucket
// 			.file(filePath)
// 			.download({ destination: tempFilePath });
// 		functions.logger.log(
// 			"Image downloaded locally to",
// 			tempFilePath
// 		);

// 		// Generate a thumbnail using #sharp
// 		const promises = [];
// 		got.stream(tempFilePath).pipe(sharpStream);

// 		promises.push(
// 			sharpStream
// 				.clone()
// 				.resize({ width: 320 })
// 				.toFile(`320_${fileName}`)
// 		);
// 		promises.push(
// 			sharpStream
// 				.clone()
// 				.resize({ width: 640 })
// 				.toFile(`640_${fileName}`)
// 		);
// 		promises.push(
// 			sharpStream
// 				.clone()
// 				.resize({ width: 1280 })
// 				.toFile(`1280_${fileName}`)
// 		);

// 		Promise.all(promises)
// 			.then((res) => {
// 				console.log("Done!", res);
// 			})
// 			.catch((err) => {
// 				console.error(
// 					"Error processing files, let's clean it up",
// 					err
// 				);
// 				try {
// 					fs.unlinkSync(`320_${fileName}`);
// 					fs.unlinkSync(`640_${fileName}`);
// 					fs.unlinkSync(`1280_${fileName}`);
// 				} catch (e) {}
// 			});
// 		// logging
// 		functions.logger.log(
// 			"Thumbnail created at",
// 			tempFilePath
// 		);
// 		// We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
// 		const thumbFileName = `thumb_${fileName}`;
// 		const thumbFilePath = path.join(
// 			path.dirname(filePath),
// 			thumbFileName
// 		);
// 		// Uploading the thumbnail.
// 		await bucket.upload(tempFilePath, {
// 			destination: thumbFilePath,
// 			metadata: metadata,
// 		});
// 		// Once the thumbnail has been uploaded delete the local file to free up disk space.
// 		return fs.unlinkSync(tempFilePath);
// 	});

// const fileBucket = object.bucket; // The Storage bucket that contains the file.
// const filePath = object.name; // File path in the bucket.
// const contentType = object.contentType; // File content type.
// const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

// const { sharp } = require("sharp");
// const { Storage } = require("@google-cloud/storage");

// exports.generateThumbnail = functions.storage
// 	.object()
// 	.onFinalize(async (object) => {
// 		// ...
// 		const fileBucket = object.bucket; // The Storage bucket that contains the file.
// 		const filePath = object.name; // File path in the bucket.
// 		const contentType = object.contentType; // File content type.
// 		const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
// 		const storage = new Storage().bucket(fileBucket);

// 		sharp(filePath)
// 			.resize({ width: 320 })
// 			.toBuffer()
// 			.then((data) => {
// 				console.log(data);
// 				data
// 					.createReadStream()
// 					.pipe(
// 						storage
// 							.file(`${data.filename}_thumb_320`)
// 							.createWriteStream()
// 					)
// 					.on("finish", () =>
// 						resolve(`/thumb/${data.filename}_thumb_320`)
// 					)
// 					.on("error", () => reject());
// 			});
// 	});

// import { Storage } from "@google-cloud/storage";
// import { sharp } from "sharp";

// export function thumbGCS(event, context) {
// 	const gcsEvent = event;
// 	const storage = new Storage().bucket(fileBucket);
// 	sharp(context.resource.name)
// 		.resize({ width: 320 })
// 		.toBuffer()
// 		.then((data) => {
// 			data
// 				.createReadStream()
// 				.pipe(
// 					storage
// 						.file(`${data.filename}_thumb_320`)
// 						.createWriteStream()
// 				)
// 				.on("finish", () =>
// 					resolve(`/thumb/${data.filename}_thumb_320`)
// 				)
// 				.on("error", () => reject());
// 		});
// 	console.log(`Processing file: ${gcsEvent.name}`);
// }

// // Copyright 202 Google LLC
// //
// // Licensed under the Apache License, Version 2.0 (the "License");
// // you may not use this file except in compliance with the License.
// // You may obtain a copy of the License at
// //
// //     https://www.apache.org/licenses/LICENSE-2.0
// //
// // Unless required by applicable law or agreed to in writing, software
// // distributed under the License is distributed on an "AS IS" BASIS,
// // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// // See the License for the specific language governing permissions and
// // limitations under the License.
// const express = require("express");
// const imageMagick = require("imagemagick");
// const Promise = require("bluebird");
// const path = require("path");
// const { Storage } = require("@google-cloud/storage");
// const Firestore = require("@google-cloud/firestore");

// const app = express();

// app.get("/", async (req, res) => {
// 	try {
// 		console.log("Collage request");

// 		const thumbnailFiles = [];
// 		const pictureStore = new Firestore().collection(
// 			"pictures"
// 		);
// 		const snapshot = await pictureStore
// 			.where("thumbnail", "==", true)
// 			.orderBy("created", "desc")
// 			.limit(4)
// 			.get();

// 		if (snapshot.empty) {
// 			console.log("Empty collection, no collage to make");
// 			res.status(204).send("No collage created.");
// 		} else {
// 			snapshot.forEach((doc) => {
// 				thumbnailFiles.push(doc.id);
// 			});
// 			console.log(
// 				`Picture file names: ${JSON.stringify(
// 					thumbnailFiles
// 				)}`
// 			);

// 			const thumbBucket = new Storage().bucket(
// 				process.env.BUCKET_THUMBNAILS
// 			);

// 			await Promise.all(
// 				thumbnailFiles.map(async (fileName) => {
// 					const filePath = path.resolve("/tmp", fileName);
// 					console.log(`Downloading ${fileName}...`);
// 					await thumbBucket.file(fileName).download({
// 						destination: filePath,
// 					});
// 				})
// 			);
// 			console.log("Downloaded all thumbnails");

// 			const collagePath = path.resolve(
// 				"/tmp",
// 				"collage.png"
// 			);

// 			const thumbnailPaths = thumbnailFiles.map((f) =>
// 				path.resolve("/tmp", f)
// 			);
// 			const convert = Promise.promisify(
// 				imageMagick.convert
// 			);
// 			await convert([
// 				"(",
// 				...thumbnailPaths.slice(0, 2),
// 				"+append",
// 				")",
// 				"(",
// 				...thumbnailPaths.slice(2),
// 				"+append",
// 				")",
// 				"-size",
// 				"400x400",
// 				"xc:none",
// 				"-background",
// 				"none",
// 				"-append",
// 				"-trim",
// 				collagePath,
// 			]);
// 			console.log("Created local collage picture");

// 			await thumbBucket.upload(collagePath);
// 			console.log(
// 				`Uploaded collage to Cloud Storage bucket ${process.env.BUCKET_THUMBNAILS}`
// 			);

// 			res.status(204).send("Collage created.");
// 		}
// 	} catch (err) {
// 		console.log(`Error: creating the collage: ${err}`);
// 		console.error(err);
// 		res.status(500).send(err);
// 	}
// });

// const PORT = process.env.PORT || 8080;

// app.listen(PORT, () => {
// 	console.log(`Started collage service on port ${PORT}`);
// });
