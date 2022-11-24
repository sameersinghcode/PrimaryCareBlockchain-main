"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app_1 = require("../app");
var prisma_client_1 = __importDefault(require("../prisma-client"));
var celebrate_1 = require("celebrate");
var auth_1 = require("firebase-admin/auth");
var publicRouter = express_1.default.Router();
publicRouter.get('/stripeSecret', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var intent;
    return __generator(this, function (_a) {
        intent = res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
        return [2 /*return*/];
    });
}); });
publicRouter.post('/webhook', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, sig, endpointSecret, event, session, purchasedMemoId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = req.body;
                sig = req.headers['stripe-signature'];
                endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
                try {
                    event = app_1.stripe.webhooks.constructEvent(payload, sig, endpointSecret);
                }
                catch (e) {
                    console.log(e.message);
                    return [2 /*return*/, res.status(400).send("Webhook Error: ".concat(e.message))];
                }
                if (!(event.type === "checkout.session.completed")) return [3 /*break*/, 4];
                session = event.data.object;
                purchasedMemoId = session.client_reference_id;
                if (!(purchasedMemoId !== null)) return [3 /*break*/, 2];
                return [4 /*yield*/, prisma_client_1.default.memo.update({
                        where: {
                            id: parseInt(purchasedMemoId)
                        },
                        data: {
                            patientHasAccess: true,
                            stripeSessionId: session.id
                        }
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                console.log("ERROR: Stripe checkout.session.completed event has no client_reference_id");
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                console.log(event);
                console.log("Unhandled event type ".concat(event.type));
                _a.label = 5;
            case 5: return [2 /*return*/, res.status(200).send()];
        }
    });
}); });
publicRouter.post('/createDoctor', (0, celebrate_1.celebrate)((_a = {},
    _a[celebrate_1.Segments.BODY] = celebrate_1.Joi.object().keys({
        email: celebrate_1.Joi.string().required(),
        password: celebrate_1.Joi.string().required()
    }),
    _a)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, errorMessage, userRecord, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                console.log("Creating doctor: " + email);
                errorMessage = "";
                return [4 /*yield*/, (0, auth_1.getAuth)().createUser({
                        email: email,
                        password: password
                    }).catch(function (e) {
                        console.log("Firebase error when creating doctor record: " + email);
                        errorMessage = getMessageFromErrorCode(e.errorInfo.code);
                    })];
            case 1:
                userRecord = _b.sent();
                if (errorMessage != "") {
                    return [2 /*return*/, res.status(400).send(errorMessage)];
                }
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, prisma_client_1.default.$transaction([
                        prisma_client_1.default.user.create({
                            data: {
                                uid: userRecord.uid,
                                email: email
                            }
                        }),
                        prisma_client_1.default.doctor.create({
                            data: {
                                uid: userRecord.uid
                            }
                        }),
                        prisma_client_1.default.userRoles.create({
                            data: {
                                uid: userRecord.uid,
                                role: 'DOCTOR'
                            }
                        })
                    ])];
            case 3:
                _b.sent();
                return [2 /*return*/, res.status(200).send('Doctor record created for ' + userRecord.email)];
            case 4:
                e_1 = _b.sent();
                console.log("Error creating doctor record");
                if (e_1 instanceof Error) {
                    console.log(e_1.message);
                }
                return [2 /*return*/, res.status(500).send("Something went wrong. Please try again.")];
            case 5: return [2 /*return*/];
        }
    });
}); });
publicRouter.post('/createPatient', (0, celebrate_1.celebrate)((_b = {},
    _b[celebrate_1.Segments.BODY] = celebrate_1.Joi.object().keys({
        email: celebrate_1.Joi.string().required(),
        password: celebrate_1.Joi.string().required()
    }),
    _b)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, errorMessage, userRecord, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                console.log("Creating patient: " + email);
                errorMessage = "";
                return [4 /*yield*/, (0, auth_1.getAuth)().createUser({
                        email: email,
                        password: password
                    }).catch(function (e) {
                        console.log("Firebase error when creating patient record: " + email);
                        errorMessage = getMessageFromErrorCode(e.errorInfo.code);
                    })];
            case 1:
                userRecord = _b.sent();
                if (errorMessage != "") {
                    return [2 /*return*/, res.status(400).send(errorMessage)];
                }
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, prisma_client_1.default.$transaction([
                        prisma_client_1.default.user.create({
                            data: {
                                uid: userRecord.uid,
                                email: email
                            }
                        }),
                        prisma_client_1.default.patient.create({
                            data: {
                                uid: userRecord.uid
                            }
                        }),
                        prisma_client_1.default.userRoles.create({
                            data: {
                                uid: userRecord.uid,
                                role: 'PATIENT'
                            }
                        })
                    ])];
            case 3:
                _b.sent();
                return [2 /*return*/, res.status(200).send('Patient record created for ' + userRecord.email)];
            case 4:
                e_2 = _b.sent();
                console.log("Error creating patient record");
                if (e_2 instanceof Error) {
                    console.log(e_2.message);
                }
                return [2 /*return*/, res.status(500).send("Something went wrong. Please try again.")];
            case 5: return [2 /*return*/];
        }
    });
}); });
function getMessageFromErrorCode(errorCode) {
    var slicedCode = errorCode.slice(5);
    switch (slicedCode) {
        case "ERROR_EMAIL_ALREADY_IN_USE":
        case "account-exists-with-different-credential":
        case "email-already-in-use":
            return "Email already used. Go to login page.";
            break;
        case "ERROR_WRONG_PASSWORD":
        case "wrong-password":
            return "Wrong email/password combination.";
            break;
        case "ERROR_USER_NOT_FOUND":
        case "user-not-found":
            return "No user found with this email.";
            break;
        case "ERROR_USER_DISABLED":
        case "user-disabled":
            return "User disabled.";
            break;
        case "ERROR_TOO_MANY_REQUESTS":
        case "operation-not-allowed":
            return "Too many requests to log into this account.";
            break;
        case "ERROR_OPERATION_NOT_ALLOWED":
        case "operation-not-allowed":
            return "Server error, please try again later.";
            break;
        case "ERROR_INVALID_EMAIL":
        case "invalid-email":
            return "Email address is invalid.";
            break;
        case "email-already-exists":
            return "A user with that email account already exists.";
            break;
        default:
            return "Login failed. Please try again.";
            break;
    }
}
exports.default = publicRouter;
//# sourceMappingURL=public.js.map