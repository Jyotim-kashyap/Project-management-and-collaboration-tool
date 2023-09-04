const express = require('express');
const router = express.Router();

const {
  create,
  getAll,
  taskAddToSprint,
  getAllArchived,
  completeSprint,
  archiveSprint,
  unarchiveSprint,
  taskRemoveFromSprint,
  updateSprint,
  deleteSprint
} = require('../controllers/sprint');


router.post('/sprint', create);
router.get('/sprint/:projectId', getAll);
router.get('/sprint/:sprintId/:taskId', taskAddToSprint);
router.get('/sprint/:projectId/archived/all', getAllArchived);
router.patch('/sprint/complete/:completeSprintId', completeSprint);
router.patch('/sprint/archive/:sprintId', archiveSprint);
router.patch('/sprint/unarchive/:sprintId', unarchiveSprint);
router.patch('/sprint/:sprintId/:taskId', taskRemoveFromSprint);
router.patch('/sprint/:sprintId', updateSprint);
router.delete('/sprint/:sprintId', deleteSprint);

module.exports = router;
