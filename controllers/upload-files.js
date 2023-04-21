const key = require('../key')

//require multer to read file values
const multer = require('multer')

const { getStorage, ref, uploadBytes } = require("firebase/storage");
//initializes the storage
const storage = getStorage(key.application)

//gets a storage reference

const storageRef = ref(storage)


