import express from "express";
import { uploadExcelFile } from "../controller/uploadFile/uploadExcelFile.controller.js";
import { upload } from "../services/multer.services.js";
import { getAllIngestionRecords } from "../controller/IngestionRecord/getAllIngestionRecords.js";
import { getColumnData } from "../controller/mapping/FetchInternalColumn.js";
import { getColumnNamesFromIngestionRecordId } from "../controller/mapping/getColumnNamesFromExcel.js";
import { deleteIngestionRecord } from "../controller/IngestionRecord/DeleteIngestionRecord.js";
import { SaveMappingFile } from "../controller/mapping/SaveMappingFile.js";
import { fetchIngestionDetails } from "../controller/userDetails/FetchUser/fetchIngestionDetails.js";
import { updateUserDetails } from "../controller/userDetails/saveEditedUser/updateUserDetails .js";
import { deleteUserFile } from "../controller/userDetails/deleteEditedUserDetails/deleteUserFile.js";
import { updateIngestionDetailsById, fetchIngestionDetailsById } from "../controller/userDetails/updateUserinExcel/fetchIngestionDetailsbyRecordId .js";
import { getMappingColumnData, fetchMappingColumnRecord } from "../controller/mapping/EditMapping.js";
import { deleteUserRecords } from "../controller/userDetails/deleteUserRecords/deleteUserRecord.js";
import { fetchMappingColumns } from "../controller/mapping/fetchMappingColumns/fetchMappingColumns.js";
import { InternalColumnHeader } from "../controller/userDetails/internalcolumnTest/InternalColumnHeader.js";
import { fetchInternalColumnNames } from "../controller/userDetails/internalcolumnTest/fetchUserColumnName.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

// Authorization endpoint
router.get('/authorize', authorize(), (req, res) => {
  // The role name is already extracted by the authorize middleware
  res.json({ role: req.user.RoleName });
});

// Route to handle file upload
router.post("/upload", authorize("admin"), upload.single("excelFile"), uploadExcelFile);

// Other routes with authorization
router.get('/fetchIngestionRecords', authorize(['admin', 'user']), getAllIngestionRecords);
router.get("/getColumnData", authorize(['admin', 'user']), getColumnData);
router.get("/getColumnNamesFromIngestionRecordId/:id", authorize(['admin', 'user']), getColumnNamesFromIngestionRecordId);
router.delete("/deleteIngestionRecord/:id", authorize(['admin', 'user']), deleteIngestionRecord);
router.post("/SaveMappingFile", authorize(['admin', 'user']), SaveMappingFile);
router.get('/fetchIngestionDetails/:id', authorize(['admin', 'user']), fetchIngestionDetails);

// Routes for user details
router.post('/updateUserDetails/:id', authorize(['admin', 'user']), updateUserDetails);
router.delete('/deleteUserFile/:id', authorize(['admin', 'user']), deleteUserFile);
router.put('/updateIngestionDetailsById/:id/details', authorize(['admin', 'user']), updateIngestionDetailsById);
router.get('/fetchIngestionDetailsById/:id/details', authorize(['admin', 'user']), fetchIngestionDetailsById);
router.delete('/deleteUserRecords/:id/details', authorize(['admin', 'user']), deleteUserRecords);

// Routes for mapping
router.get('/getMappingColumnData/:id', authorize(['admin', 'user']), getMappingColumnData);
router.get('/fetchMappingColumnRecord/:id', authorize(['admin', 'user']), fetchMappingColumnRecord);
router.get('/mappingColumns/:id', authorize(['admin', 'user']), fetchMappingColumns);

// Other routes
router.get('/InternalColumnHeader', authorize(['admin', 'user']), InternalColumnHeader);
router.get('/fetchInternalColumnNames/:id', authorize(['admin', 'user']), fetchInternalColumnNames);

export default router;
