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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendApplicationEmails = sendApplicationEmails;
exports.sendContactEmail = sendContactEmail;
var nodemailer_1 = require("nodemailer");
var site_1 = require("@/lib/site");
function getTransport() {
    var host = process.env.SMTP_HOST;
    var port = process.env.SMTP_PORT;
    var user = process.env.SMTP_USER;
    var pass = process.env.SMTP_PASS;
    if (!host || !port || !user || !pass) {
        return null;
    }
    return nodemailer_1.default.createTransport({
        host: host,
        port: Number(port),
        secure: Number(port) === 465,
        auth: {
            user: user,
            pass: pass,
        },
    });
}
function sendApplicationEmails(input) {
    return __awaiter(this, void 0, void 0, function () {
        var transporter, from, applicationLink;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transporter = getTransport();
                    if (!transporter) {
                        console.warn("SMTP credentials are missing. Skipping email delivery.");
                        return [2 /*return*/];
                    }
                    from = process.env.SMTP_FROM || process.env.SMTP_USER;
                    applicationLink = "".concat(site_1.defaultSiteUrl, "/admin/applications?application=").concat(input.applicationId);
                    return [4 /*yield*/, Promise.all(__spreadArray([
                            transporter.sendMail({
                                from: from,
                                to: input.applicantEmail,
                                subject: "Application received for ".concat(input.jobTitle),
                                html: "\n        <div style=\"font-family:Arial,sans-serif;line-height:1.6\">\n          <h2>Thanks for applying to ".concat(input.jobTitle, "</h2>\n          <p>Hello ").concat(input.applicantName, ",</p>\n          <p>We have received your application at Draft Consulting. Our recruitment team will review it and contact you if your profile matches the role.</p>\n          <p>You do not need to take any further action right now.</p>\n        </div>\n      "),
                            })
                        ], (input.adminRecipients.length > 0
                            ? [
                                transporter.sendMail({
                                    from: from,
                                    to: input.adminRecipients.join(","),
                                    subject: "New application: ".concat(input.jobTitle),
                                    html: "\n              <div style=\"font-family:Arial,sans-serif;line-height:1.6\">\n                <h2>New application received</h2>\n                <p>".concat(input.applicantName, " has applied for <strong>").concat(input.jobTitle, "</strong>.</p>\n                <p><a href=\"").concat(applicationLink, "\">Open the application in the admin dashboard</a></p>\n              </div>\n            "),
                                }),
                            ]
                            : []), true))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function sendContactEmail(input) {
    return __awaiter(this, void 0, void 0, function () {
        var transporter, from;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transporter = getTransport();
                    if (!transporter) {
                        console.warn("SMTP credentials are missing. Skipping email delivery.");
                        return [2 /*return*/];
                    }
                    from = process.env.SMTP_FROM || process.env.SMTP_USER;
                    return [4 /*yield*/, Promise.all(__spreadArray([
                            transporter.sendMail({
                                from: from,
                                to: input.fromEmail,
                                subject: "We received your message",
                                html: "\n        <div style=\"font-family:Arial,sans-serif;line-height:1.6\">\n          <h2>Thank you for contacting us</h2>\n          <p>Hello ".concat(input.fromName, ",</p>\n          <p>We have received your message and will get back to you as soon as possible.</p>\n          <p style=\"margin-top:20px;color:#666;font-size:13px\">\n            <strong>Your message details:</strong><br />\n            Subject: ").concat(input.subject, "<br />\n            Phone: ").concat(input.phone, "\n          </p>\n        </div>\n      "),
                            })
                        ], (input.adminRecipients.length > 0
                            ? [
                                transporter.sendMail({
                                    from: from,
                                    to: input.adminRecipients.join(","),
                                    subject: "New contact form submission: ".concat(input.subject),
                                    html: "\n              <div style=\"font-family:Arial,sans-serif;line-height:1.6\">\n                <h2>New Contact Form Submission</h2>\n                <div style=\"background:#f5f5f5;padding:15px;border-radius:5px;margin:15px 0\">\n                  <p><strong>Name:</strong> ".concat(input.fromName, "</p>\n                  <p><strong>Email:</strong> <a href=\"mailto:").concat(input.fromEmail, "\">").concat(input.fromEmail, "</a></p>\n                  <p><strong>Phone:</strong> ").concat(input.phone, "</p>\n                  <p><strong>Subject:</strong> ").concat(input.subject, "</p>\n                </div>\n                <h3>Message:</h3>\n                <p style=\"white-space:pre-wrap;line-height:1.6\">").concat(input.message, "</p>\n              </div>\n            "),
                                }),
                            ]
                            : []), true))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
