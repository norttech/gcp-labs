import * as express from 'express';
import controller from './controller';

const router = express.Router();

router.route('/').post(controller.create).get(controller.findAll);
router.route('/:id').get(controller.findById).put(controller.update).delete(controller.delete);

export default router;
