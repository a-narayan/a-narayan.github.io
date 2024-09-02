import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, runTransaction, doc } from "firebase/firestore";
import { storage, db } from "../firebase-setup/firebase";

export const uploadImage = (image) => {
    let isError = false;
    let errorMessage = '';

    if (!image) {
        // setErrorMessage("Please select an image to upload.");
        errorMessage = 'Please select an image to upload.';
        isError = true;
        return { isError, errorMessage };
    }

    // Create a storage reference
    const storageRef = ref(storage, `website_images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    // Track upload progress
    uploadTask.on(
        "state_changed",
        (snapshot) => {
            // const progress =
            //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // setUploadProgress(progress);
        },
        (error) => {
            // setErrorMessage(`Upload failed: ${error.message}`);
            isError = true;
            errorMessage = 'Could not upload the image'
            return { isError, errorMessage }
        },
        () => {
            // Handle successful upload
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                // Save the download URL to Firestore
                try {
                    await runTransaction(db, async (transaction) => {
                        const docRef = doc(db, 'images', 'website_images');
                        const sfDoc = await transaction.get(docRef);
                        if (!sfDoc.exists()) {
                            throw "Document does not exist!";
                        }
                        const links = [...sfDoc.data().links];
                        links.push(downloadURL);
                        transaction.update(docRef, { links: links });
                    });
                    console.log("Transaction successfully committed!");
                    isError = false;
                    errorMessage = '';
                    return { isError, errorMessage, url: downloadURL }
                    // setImage(null);
                    // setUploadProgress(0);
                    // setErrorMessage(null);
                    // alert("Image uploaded and URL saved successfully!");
                } catch (e) {
                    console.log("Transaction failed: ", e);
                    isError = true;
                    errorMessage = 'Could not upload the image';
                    return { isError, errorMessage }
                }
            });
        }
    );


};