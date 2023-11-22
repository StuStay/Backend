import { Router as _Router } from "express";
import { Add } from "../controllers/flouci.js";
import { Verify } from "../controllers/flouci.js";
const Router = _Router();

Router.post('/flouci', Add);
Router.post('/flouci/:id', Verify);

export default Router;