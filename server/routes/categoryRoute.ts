import express, { Router } from 'express'
import categoryCtrl from '../controllers/categoryCtrl'
import { auth } from '../middleware/auth'

const router = express.Router()

router.route('/category')
    .get(categoryCtrl.getCategory)
    .post(auth,categoryCtrl.createCategory) // cac tac vu lien quan den id deu thong qua token
router.route('/category/:id')
    .patch(auth,categoryCtrl.updateCategory)
    .delete(auth,categoryCtrl.deleteCategory)

export default router