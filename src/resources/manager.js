import fs from "fs";
import {session} from "../util";

session.loadingCount = 0;
session.loadingTotal = 0;
export const resources = JSON.parse(fs.readFileSync("assets/resources.json").toString()) || require("../../assets/resources.json");