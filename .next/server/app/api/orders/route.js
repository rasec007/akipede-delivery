"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/orders/route";
exports.ids = ["app/api/orders/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "dns":
/*!**********************!*\
  !*** external "dns" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("dns");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "http2":
/*!************************!*\
  !*** external "http2" ***!
  \************************/
/***/ ((module) => {

module.exports = require("http2");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("net");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("tls");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Forders%2Froute&page=%2Fapi%2Forders%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Forders%2Froute.ts&appDir=C%3A%5CUsers%5Csolra%5CDesktop%5Crasec%5CProjetos%5Cakipede-delivery%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Csolra%5CDesktop%5Crasec%5CProjetos%5Cakipede-delivery&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Forders%2Froute&page=%2Fapi%2Forders%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Forders%2Froute.ts&appDir=C%3A%5CUsers%5Csolra%5CDesktop%5Crasec%5CProjetos%5Cakipede-delivery%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Csolra%5CDesktop%5Crasec%5CProjetos%5Cakipede-delivery&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_solra_Desktop_rasec_Projetos_akipede_delivery_src_app_api_orders_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/orders/route.ts */ \"(rsc)/./src/app/api/orders/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"standalone\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/orders/route\",\n        pathname: \"/api/orders\",\n        filename: \"route\",\n        bundlePath: \"app/api/orders/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\solra\\\\Desktop\\\\rasec\\\\Projetos\\\\akipede-delivery\\\\src\\\\app\\\\api\\\\orders\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_solra_Desktop_rasec_Projetos_akipede_delivery_src_app_api_orders_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/orders/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZvcmRlcnMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRm9yZGVycyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRm9yZGVycyUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNzb2xyYSU1Q0Rlc2t0b3AlNUNyYXNlYyU1Q1Byb2pldG9zJTVDYWtpcGVkZS1kZWxpdmVyeSU1Q3NyYyU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDc29scmElNUNEZXNrdG9wJTVDcmFzZWMlNUNQcm9qZXRvcyU1Q2FraXBlZGUtZGVsaXZlcnkmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9c3RhbmRhbG9uZSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUM2QztBQUMxSDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL2FraXBlZGUtZGVsaXZlcnkvP2FhYzkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcc29scmFcXFxcRGVza3RvcFxcXFxyYXNlY1xcXFxQcm9qZXRvc1xcXFxha2lwZWRlLWRlbGl2ZXJ5XFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXG9yZGVyc1xcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJzdGFuZGFsb25lXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL29yZGVycy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL29yZGVyc1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvb3JkZXJzL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcc29scmFcXFxcRGVza3RvcFxcXFxyYXNlY1xcXFxQcm9qZXRvc1xcXFxha2lwZWRlLWRlbGl2ZXJ5XFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXG9yZGVyc1xcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvb3JkZXJzL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Forders%2Froute&page=%2Fapi%2Forders%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Forders%2Froute.ts&appDir=C%3A%5CUsers%5Csolra%5CDesktop%5Crasec%5CProjetos%5Cakipede-delivery%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Csolra%5CDesktop%5Crasec%5CProjetos%5Cakipede-delivery&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/orders/route.ts":
/*!*************************************!*\
  !*** ./src/app/api/orders/route.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _server_services_OrderService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/server/services/OrderService */ \"(rsc)/./src/server/services/OrderService.ts\");\n/* harmony import */ var _lib_api_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/api-helpers */ \"(rsc)/./src/lib/api-helpers.ts\");\n\n\n\nasync function GET(req) {\n    try {\n        const { tenantId } = (0,_lib_api_helpers__WEBPACK_IMPORTED_MODULE_2__.getAuthContext)();\n        if (!tenantId) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"N\\xe3o autorizado\"\n        }, {\n            status: 401\n        });\n        const { searchParams } = new URL(req.url);\n        const status = searchParams.get(\"status\") || undefined;\n        const orderService = new _server_services_OrderService__WEBPACK_IMPORTED_MODULE_1__.OrderService(tenantId);\n        const orders = await orderService.listByStatus(status);\n        // Mapeia para incluir o status virtual baseado nos timestamps e resolve BigInt\n        const mappedOrders = orders.map((order)=>{\n            let virtualStatus = \"PENDING\";\n            if (order.cancelado) virtualStatus = \"CANCELLED\";\n            else if (order.entregue) virtualStatus = \"COMPLETED\";\n            else if (order.saiu_entrega) virtualStatus = \"DELIVERING\";\n            else if (order.preparo) virtualStatus = \"PREPARING\";\n            return {\n                ...order,\n                status: virtualStatus,\n                customerName: order.usuario_pedido_usuarioTousuario?.nome || \"Cliente\",\n                address: order.endereco_pedido_enderecoToendereco ? `${order.endereco_pedido_enderecoToendereco.logradouro}, ${order.endereco_pedido_enderecoToendereco.numero}` : \"Balc\\xe3o / Retirada\",\n                num: order.num ? Number(order.num) : 0 // Converter BigInt para Number para o JSON\n            };\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(mappedOrders);\n    } catch (error) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error.message\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9vcmRlcnMvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUEyQztBQUNtQjtBQUNYO0FBRTVDLGVBQWVHLElBQUlDLEdBQVk7SUFDcEMsSUFBSTtRQUNGLE1BQU0sRUFBRUMsUUFBUSxFQUFFLEdBQUdILGdFQUFjQTtRQUNuQyxJQUFJLENBQUNHLFVBQVUsT0FBT0wscURBQVlBLENBQUNNLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQWlCLEdBQUc7WUFBRUMsUUFBUTtRQUFJO1FBRW5GLE1BQU0sRUFBRUMsWUFBWSxFQUFFLEdBQUcsSUFBSUMsSUFBSU4sSUFBSU8sR0FBRztRQUN4QyxNQUFNSCxTQUFTQyxhQUFhRyxHQUFHLENBQUMsYUFBYUM7UUFFN0MsTUFBTUMsZUFBZSxJQUFJYix1RUFBWUEsQ0FBQ0k7UUFDdEMsTUFBTVUsU0FBUyxNQUFNRCxhQUFhRSxZQUFZLENBQUNSO1FBRS9DLCtFQUErRTtRQUMvRSxNQUFNUyxlQUFlRixPQUFPRyxHQUFHLENBQUMsQ0FBQ0M7WUFDL0IsSUFBSUMsZ0JBQWdCO1lBQ3BCLElBQUlELE1BQU1FLFNBQVMsRUFBRUQsZ0JBQWdCO2lCQUNoQyxJQUFJRCxNQUFNRyxRQUFRLEVBQUVGLGdCQUFnQjtpQkFDcEMsSUFBSUQsTUFBTUksWUFBWSxFQUFFSCxnQkFBZ0I7aUJBQ3hDLElBQUlELE1BQU1LLE9BQU8sRUFBRUosZ0JBQWdCO1lBRXhDLE9BQU87Z0JBQ0wsR0FBR0QsS0FBSztnQkFDUlgsUUFBUVk7Z0JBQ1JLLGNBQWNOLE1BQU1PLCtCQUErQixFQUFFQyxRQUFRO2dCQUM3REMsU0FBU1QsTUFBTVUsa0NBQWtDLEdBQy9DLENBQUMsRUFBRVYsTUFBTVUsa0NBQWtDLENBQUNDLFVBQVUsQ0FBQyxFQUFFLEVBQUVYLE1BQU1VLGtDQUFrQyxDQUFDRSxNQUFNLENBQUMsQ0FBQyxHQUM1RztnQkFDRkMsS0FBS2IsTUFBTWEsR0FBRyxHQUFHQyxPQUFPZCxNQUFNYSxHQUFHLElBQUksRUFBRSwyQ0FBMkM7WUFDcEY7UUFDRjtRQUVBLE9BQU9oQyxxREFBWUEsQ0FBQ00sSUFBSSxDQUFDVztJQUMzQixFQUFFLE9BQU9WLE9BQVk7UUFDbkIsT0FBT1AscURBQVlBLENBQUNNLElBQUksQ0FBQztZQUFFQyxPQUFPQSxNQUFNMkIsT0FBTztRQUFDLEdBQUc7WUFBRTFCLFFBQVE7UUFBSTtJQUNuRTtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYWtpcGVkZS1kZWxpdmVyeS8uL3NyYy9hcHAvYXBpL29yZGVycy9yb3V0ZS50cz84ZDI5Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuaW1wb3J0IHsgT3JkZXJTZXJ2aWNlIH0gZnJvbSBcIkAvc2VydmVyL3NlcnZpY2VzL09yZGVyU2VydmljZVwiO1xuaW1wb3J0IHsgZ2V0QXV0aENvbnRleHQgfSBmcm9tIFwiQC9saWIvYXBpLWhlbHBlcnNcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXE6IFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IHRlbmFudElkIH0gPSBnZXRBdXRoQ29udGV4dCgpO1xuICAgIGlmICghdGVuYW50SWQpIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIk7Do28gYXV0b3JpemFkb1wiIH0sIHsgc3RhdHVzOiA0MDEgfSk7XG5cbiAgICBjb25zdCB7IHNlYXJjaFBhcmFtcyB9ID0gbmV3IFVSTChyZXEudXJsKTtcbiAgICBjb25zdCBzdGF0dXMgPSBzZWFyY2hQYXJhbXMuZ2V0KFwic3RhdHVzXCIpIHx8IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IG9yZGVyU2VydmljZSA9IG5ldyBPcmRlclNlcnZpY2UodGVuYW50SWQpO1xuICAgIGNvbnN0IG9yZGVycyA9IGF3YWl0IG9yZGVyU2VydmljZS5saXN0QnlTdGF0dXMoc3RhdHVzKTtcblxuICAgIC8vIE1hcGVpYSBwYXJhIGluY2x1aXIgbyBzdGF0dXMgdmlydHVhbCBiYXNlYWRvIG5vcyB0aW1lc3RhbXBzIGUgcmVzb2x2ZSBCaWdJbnRcbiAgICBjb25zdCBtYXBwZWRPcmRlcnMgPSBvcmRlcnMubWFwKChvcmRlcjogYW55KSA9PiB7XG4gICAgICBsZXQgdmlydHVhbFN0YXR1cyA9IFwiUEVORElOR1wiO1xuICAgICAgaWYgKG9yZGVyLmNhbmNlbGFkbykgdmlydHVhbFN0YXR1cyA9IFwiQ0FOQ0VMTEVEXCI7XG4gICAgICBlbHNlIGlmIChvcmRlci5lbnRyZWd1ZSkgdmlydHVhbFN0YXR1cyA9IFwiQ09NUExFVEVEXCI7XG4gICAgICBlbHNlIGlmIChvcmRlci5zYWl1X2VudHJlZ2EpIHZpcnR1YWxTdGF0dXMgPSBcIkRFTElWRVJJTkdcIjtcbiAgICAgIGVsc2UgaWYgKG9yZGVyLnByZXBhcm8pIHZpcnR1YWxTdGF0dXMgPSBcIlBSRVBBUklOR1wiO1xuICAgICAgXG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5vcmRlcixcbiAgICAgICAgc3RhdHVzOiB2aXJ0dWFsU3RhdHVzLFxuICAgICAgICBjdXN0b21lck5hbWU6IG9yZGVyLnVzdWFyaW9fcGVkaWRvX3VzdWFyaW9Ub3VzdWFyaW8/Lm5vbWUgfHwgXCJDbGllbnRlXCIsXG4gICAgICAgIGFkZHJlc3M6IG9yZGVyLmVuZGVyZWNvX3BlZGlkb19lbmRlcmVjb1RvZW5kZXJlY28gPyBcbiAgICAgICAgICBgJHtvcmRlci5lbmRlcmVjb19wZWRpZG9fZW5kZXJlY29Ub2VuZGVyZWNvLmxvZ3JhZG91cm99LCAke29yZGVyLmVuZGVyZWNvX3BlZGlkb19lbmRlcmVjb1RvZW5kZXJlY28ubnVtZXJvfWAgOiBcbiAgICAgICAgICBcIkJhbGPDo28gLyBSZXRpcmFkYVwiLFxuICAgICAgICBudW06IG9yZGVyLm51bSA/IE51bWJlcihvcmRlci5udW0pIDogMCAvLyBDb252ZXJ0ZXIgQmlnSW50IHBhcmEgTnVtYmVyIHBhcmEgbyBKU09OXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKG1hcHBlZE9yZGVycyk7XG4gIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogZXJyb3IubWVzc2FnZSB9LCB7IHN0YXR1czogNTAwIH0pO1xuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiT3JkZXJTZXJ2aWNlIiwiZ2V0QXV0aENvbnRleHQiLCJHRVQiLCJyZXEiLCJ0ZW5hbnRJZCIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsInNlYXJjaFBhcmFtcyIsIlVSTCIsInVybCIsImdldCIsInVuZGVmaW5lZCIsIm9yZGVyU2VydmljZSIsIm9yZGVycyIsImxpc3RCeVN0YXR1cyIsIm1hcHBlZE9yZGVycyIsIm1hcCIsIm9yZGVyIiwidmlydHVhbFN0YXR1cyIsImNhbmNlbGFkbyIsImVudHJlZ3VlIiwic2FpdV9lbnRyZWdhIiwicHJlcGFybyIsImN1c3RvbWVyTmFtZSIsInVzdWFyaW9fcGVkaWRvX3VzdWFyaW9Ub3VzdWFyaW8iLCJub21lIiwiYWRkcmVzcyIsImVuZGVyZWNvX3BlZGlkb19lbmRlcmVjb1RvZW5kZXJlY28iLCJsb2dyYWRvdXJvIiwibnVtZXJvIiwibnVtIiwiTnVtYmVyIiwibWVzc2FnZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/orders/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/api-helpers.ts":
/*!********************************!*\
  !*** ./src/lib/api-helpers.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getAuthContext: () => (/* binding */ getAuthContext)\n/* harmony export */ });\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n\nfunction getAuthContext() {\n    const headerList = (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.headers)();\n    const userId = headerList.get(\"x-user-id\");\n    const tenantId = headerList.get(\"x-tenant-id\");\n    const role = headerList.get(\"x-user-role\");\n    return {\n        userId,\n        tenantId,\n        role\n    };\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2FwaS1oZWxwZXJzLnRzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQXVDO0FBRWhDLFNBQVNDO0lBQ2QsTUFBTUMsYUFBYUYscURBQU9BO0lBQzFCLE1BQU1HLFNBQVNELFdBQVdFLEdBQUcsQ0FBQztJQUM5QixNQUFNQyxXQUFXSCxXQUFXRSxHQUFHLENBQUM7SUFDaEMsTUFBTUUsT0FBT0osV0FBV0UsR0FBRyxDQUFDO0lBRTVCLE9BQU87UUFBRUQ7UUFBUUU7UUFBVUM7SUFBSztBQUNsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2FraXBlZGUtZGVsaXZlcnkvLi9zcmMvbGliL2FwaS1oZWxwZXJzLnRzP2NhZDMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaGVhZGVycyB9IGZyb20gXCJuZXh0L2hlYWRlcnNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEF1dGhDb250ZXh0KCkge1xuICBjb25zdCBoZWFkZXJMaXN0ID0gaGVhZGVycygpO1xuICBjb25zdCB1c2VySWQgPSBoZWFkZXJMaXN0LmdldChcIngtdXNlci1pZFwiKTtcbiAgY29uc3QgdGVuYW50SWQgPSBoZWFkZXJMaXN0LmdldChcIngtdGVuYW50LWlkXCIpO1xuICBjb25zdCByb2xlID0gaGVhZGVyTGlzdC5nZXQoXCJ4LXVzZXItcm9sZVwiKTtcblxuICByZXR1cm4geyB1c2VySWQsIHRlbmFudElkLCByb2xlIH07XG59XG4iXSwibmFtZXMiOlsiaGVhZGVycyIsImdldEF1dGhDb250ZXh0IiwiaGVhZGVyTGlzdCIsInVzZXJJZCIsImdldCIsInRlbmFudElkIiwicm9sZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/api-helpers.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/prisma.ts":
/*!***************************!*\
  !*** ./src/lib/prisma.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getTenantPrisma: () => (/* binding */ getTenantPrisma),\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = global;\nconst prisma = globalForPrisma.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log: [\n        \"query\"\n    ]\n});\nif (true) globalForPrisma.prisma = prisma;\n/**\n * Função para criar um cliente Prisma com RLS configurado\n * @param tenantId ID da empresa atual\n */ function getTenantPrisma(tenantId) {\n    return prisma.$extends({\n        query: {\n            $allModels: {\n                async $allOperations ({ args, query }) {\n                    // Injeta o tenant_id na sessão do Postgres para o RLS\n                    await prisma.$executeRawUnsafe(`SET LOCAL app.current_tenant_id = '${tenantId}'`);\n                    return query(args);\n                }\n            }\n        }\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3ByaXNtYS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQThDO0FBRTlDLE1BQU1DLGtCQUFrQkM7QUFFakIsTUFBTUMsU0FDWEYsZ0JBQWdCRSxNQUFNLElBQ3RCLElBQUlILHdEQUFZQSxDQUFDO0lBQ2ZJLEtBQUs7UUFBQztLQUFRO0FBQ2hCLEdBQUc7QUFFTCxJQUFJQyxJQUFxQyxFQUFFSixnQkFBZ0JFLE1BQU0sR0FBR0E7QUFFcEU7OztDQUdDLEdBQ00sU0FBU0csZ0JBQWdCQyxRQUFnQjtJQUM5QyxPQUFPSixPQUFPSyxRQUFRLENBQUM7UUFDckJDLE9BQU87WUFDTEMsWUFBWTtnQkFDVixNQUFNQyxnQkFBZSxFQUFFQyxJQUFJLEVBQUVILEtBQUssRUFBRTtvQkFDbEMsc0RBQXNEO29CQUN0RCxNQUFNTixPQUFPVSxpQkFBaUIsQ0FBQyxDQUFDLG1DQUFtQyxFQUFFTixTQUFTLENBQUMsQ0FBQztvQkFDaEYsT0FBT0UsTUFBTUc7Z0JBQ2Y7WUFDRjtRQUNGO0lBQ0Y7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL2FraXBlZGUtZGVsaXZlcnkvLi9zcmMvbGliL3ByaXNtYS50cz8wMWQ3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiO1xuXG5jb25zdCBnbG9iYWxGb3JQcmlzbWEgPSBnbG9iYWwgYXMgdW5rbm93biBhcyB7IHByaXNtYTogUHJpc21hQ2xpZW50IH07XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPVxuICBnbG9iYWxGb3JQcmlzbWEucHJpc21hIHx8XG4gIG5ldyBQcmlzbWFDbGllbnQoe1xuICAgIGxvZzogW1wicXVlcnlcIl0sXG4gIH0pO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID0gcHJpc21hO1xuXG4vKipcbiAqIEZ1bsOnw6NvIHBhcmEgY3JpYXIgdW0gY2xpZW50ZSBQcmlzbWEgY29tIFJMUyBjb25maWd1cmFkb1xuICogQHBhcmFtIHRlbmFudElkIElEIGRhIGVtcHJlc2EgYXR1YWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRlbmFudFByaXNtYSh0ZW5hbnRJZDogc3RyaW5nKSB7XG4gIHJldHVybiBwcmlzbWEuJGV4dGVuZHMoe1xuICAgIHF1ZXJ5OiB7XG4gICAgICAkYWxsTW9kZWxzOiB7XG4gICAgICAgIGFzeW5jICRhbGxPcGVyYXRpb25zKHsgYXJncywgcXVlcnkgfSkge1xuICAgICAgICAgIC8vIEluamV0YSBvIHRlbmFudF9pZCBuYSBzZXNzw6NvIGRvIFBvc3RncmVzIHBhcmEgbyBSTFNcbiAgICAgICAgICBhd2FpdCBwcmlzbWEuJGV4ZWN1dGVSYXdVbnNhZmUoYFNFVCBMT0NBTCBhcHAuY3VycmVudF90ZW5hbnRfaWQgPSAnJHt0ZW5hbnRJZH0nYCk7XG4gICAgICAgICAgcmV0dXJuIHF1ZXJ5KGFyZ3MpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn1cbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJnbG9iYWxGb3JQcmlzbWEiLCJnbG9iYWwiLCJwcmlzbWEiLCJsb2ciLCJwcm9jZXNzIiwiZ2V0VGVuYW50UHJpc21hIiwidGVuYW50SWQiLCIkZXh0ZW5kcyIsInF1ZXJ5IiwiJGFsbE1vZGVscyIsIiRhbGxPcGVyYXRpb25zIiwiYXJncyIsIiRleGVjdXRlUmF3VW5zYWZlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/prisma.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/pusher.ts":
/*!***************************!*\
  !*** ./src/lib/pusher.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   pusherServer: () => (/* binding */ pusherServer),\n/* harmony export */   triggerRealtime: () => (/* binding */ triggerRealtime)\n/* harmony export */ });\n/* harmony import */ var pusher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pusher */ \"(rsc)/./node_modules/pusher/lib/pusher.js\");\n/* harmony import */ var pusher__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pusher__WEBPACK_IMPORTED_MODULE_0__);\n\nconst pusherServer = new (pusher__WEBPACK_IMPORTED_MODULE_0___default())({\n    appId: process.env.PUSHER_APP_ID,\n    key: process.env.PUSHER_KEY,\n    secret: process.env.PUSHER_SECRET,\n    cluster: process.env.PUSHER_CLUSTER,\n    useTLS: true\n});\n/**\n * Dispara um evento em tempo real para um canal específico\n * @param channel Nome do canal (ex: tenant_ID)\n * @param event Nome do evento (ex: order_new)\n * @param data Dados a serem enviados\n */ async function triggerRealtime(channel, event, data) {\n    try {\n        await pusherServer.trigger(channel, event, data);\n    } catch (error) {\n        console.error(\"Erro ao disparar evento Pusher:\", error);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3B1c2hlci50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQTRCO0FBRXJCLE1BQU1DLGVBQWUsSUFBSUQsK0NBQU1BLENBQUM7SUFDckNFLE9BQU9DLFFBQVFDLEdBQUcsQ0FBQ0MsYUFBYTtJQUNoQ0MsS0FBS0gsUUFBUUMsR0FBRyxDQUFDRyxVQUFVO0lBQzNCQyxRQUFRTCxRQUFRQyxHQUFHLENBQUNLLGFBQWE7SUFDakNDLFNBQVNQLFFBQVFDLEdBQUcsQ0FBQ08sY0FBYztJQUNuQ0MsUUFBUTtBQUNWLEdBQUc7QUFFSDs7Ozs7Q0FLQyxHQUNNLGVBQWVDLGdCQUFnQkMsT0FBZSxFQUFFQyxLQUFhLEVBQUVDLElBQVM7SUFDN0UsSUFBSTtRQUNGLE1BQU1mLGFBQWFnQixPQUFPLENBQUNILFNBQVNDLE9BQU9DO0lBQzdDLEVBQUUsT0FBT0UsT0FBTztRQUNkQyxRQUFRRCxLQUFLLENBQUMsbUNBQW1DQTtJQUNuRDtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYWtpcGVkZS1kZWxpdmVyeS8uL3NyYy9saWIvcHVzaGVyLnRzPzQ2OTYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFB1c2hlciBmcm9tIFwicHVzaGVyXCI7XG5cbmV4cG9ydCBjb25zdCBwdXNoZXJTZXJ2ZXIgPSBuZXcgUHVzaGVyKHtcbiAgYXBwSWQ6IHByb2Nlc3MuZW52LlBVU0hFUl9BUFBfSUQhLFxuICBrZXk6IHByb2Nlc3MuZW52LlBVU0hFUl9LRVkhLFxuICBzZWNyZXQ6IHByb2Nlc3MuZW52LlBVU0hFUl9TRUNSRVQhLFxuICBjbHVzdGVyOiBwcm9jZXNzLmVudi5QVVNIRVJfQ0xVU1RFUiEsXG4gIHVzZVRMUzogdHJ1ZSxcbn0pO1xuXG4vKipcbiAqIERpc3BhcmEgdW0gZXZlbnRvIGVtIHRlbXBvIHJlYWwgcGFyYSB1bSBjYW5hbCBlc3BlY8OtZmljb1xuICogQHBhcmFtIGNoYW5uZWwgTm9tZSBkbyBjYW5hbCAoZXg6IHRlbmFudF9JRClcbiAqIEBwYXJhbSBldmVudCBOb21lIGRvIGV2ZW50byAoZXg6IG9yZGVyX25ldylcbiAqIEBwYXJhbSBkYXRhIERhZG9zIGEgc2VyZW0gZW52aWFkb3NcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRyaWdnZXJSZWFsdGltZShjaGFubmVsOiBzdHJpbmcsIGV2ZW50OiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICB0cnkge1xuICAgIGF3YWl0IHB1c2hlclNlcnZlci50cmlnZ2VyKGNoYW5uZWwsIGV2ZW50LCBkYXRhKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJybyBhbyBkaXNwYXJhciBldmVudG8gUHVzaGVyOlwiLCBlcnJvcik7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJQdXNoZXIiLCJwdXNoZXJTZXJ2ZXIiLCJhcHBJZCIsInByb2Nlc3MiLCJlbnYiLCJQVVNIRVJfQVBQX0lEIiwia2V5IiwiUFVTSEVSX0tFWSIsInNlY3JldCIsIlBVU0hFUl9TRUNSRVQiLCJjbHVzdGVyIiwiUFVTSEVSX0NMVVNURVIiLCJ1c2VUTFMiLCJ0cmlnZ2VyUmVhbHRpbWUiLCJjaGFubmVsIiwiZXZlbnQiLCJkYXRhIiwidHJpZ2dlciIsImVycm9yIiwiY29uc29sZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/pusher.ts\n");

/***/ }),

/***/ "(rsc)/./src/server/services/BaseService.ts":
/*!********************************************!*\
  !*** ./src/server/services/BaseService.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   BaseService: () => (/* binding */ BaseService)\n/* harmony export */ });\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n\nclass BaseService {\n    constructor(tenantId){\n        this.tenantId = tenantId;\n        this.db = (0,_lib_prisma__WEBPACK_IMPORTED_MODULE_0__.getTenantPrisma)(tenantId);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvc2VydmVyL3NlcnZpY2VzL0Jhc2VTZXJ2aWNlLnRzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQStDO0FBRXhDLE1BQU1DO0lBSVhDLFlBQVlDLFFBQWdCLENBQUU7UUFDNUIsSUFBSSxDQUFDQSxRQUFRLEdBQUdBO1FBQ2hCLElBQUksQ0FBQ0MsRUFBRSxHQUFHSiw0REFBZUEsQ0FBQ0c7SUFDNUI7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL2FraXBlZGUtZGVsaXZlcnkvLi9zcmMvc2VydmVyL3NlcnZpY2VzL0Jhc2VTZXJ2aWNlLnRzPzQzMjIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0VGVuYW50UHJpc21hIH0gZnJvbSBcIkAvbGliL3ByaXNtYVwiO1xuXG5leHBvcnQgY2xhc3MgQmFzZVNlcnZpY2Uge1xuICBwcm90ZWN0ZWQgdGVuYW50SWQ6IHN0cmluZztcbiAgcHJvdGVjdGVkIGRiOiBSZXR1cm5UeXBlPHR5cGVvZiBnZXRUZW5hbnRQcmlzbWE+O1xuXG4gIGNvbnN0cnVjdG9yKHRlbmFudElkOiBzdHJpbmcpIHtcbiAgICB0aGlzLnRlbmFudElkID0gdGVuYW50SWQ7XG4gICAgdGhpcy5kYiA9IGdldFRlbmFudFByaXNtYSh0ZW5hbnRJZCk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJnZXRUZW5hbnRQcmlzbWEiLCJCYXNlU2VydmljZSIsImNvbnN0cnVjdG9yIiwidGVuYW50SWQiLCJkYiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/server/services/BaseService.ts\n");

/***/ }),

/***/ "(rsc)/./src/server/services/NotificationService.ts":
/*!****************************************************!*\
  !*** ./src/server/services/NotificationService.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   NotificationService: () => (/* binding */ NotificationService)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ \"(rsc)/./node_modules/axios/lib/axios.js\");\n/* harmony import */ var nodemailer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! nodemailer */ \"(rsc)/./node_modules/nodemailer/lib/nodemailer.js\");\n\n\nclass NotificationService {\n    static{\n        this.evoUrl = process.env.EVO_URL;\n    }\n    static{\n        this.evoApiKey = process.env.EVO_APIKEY;\n    }\n    static{\n        this.smtpHost = process.env.SMTP_HOST || \"smtp.gmail.com\";\n    }\n    static{\n        this.smtpPort = Number(process.env.SMTP_PORT) || 587;\n    }\n    static{\n        this.smtpUser = process.env.SMTP_USER;\n    }\n    static{\n        this.smtpPass = process.env.SMTP_PASS;\n    }\n    /**\n   * Envia uma mensagem de texto via WhatsApp (EvolutionAPI)\n   */ static async sendWhatsApp(phone, message) {\n        if (!this.evoUrl || !this.evoApiKey) {\n            console.warn(\"EvolutionAPI n\\xe3o configurada.\");\n            return null;\n        }\n        try {\n            // Limpa o número para garantir formato correto\n            const cleanPhone = phone.replace(/\\D/g, \"\");\n            const formattedPhone = cleanPhone.startsWith(\"55\") ? cleanPhone : `55${cleanPhone}`;\n            const response = await axios__WEBPACK_IMPORTED_MODULE_1__[\"default\"].post(this.evoUrl, {\n                number: formattedPhone,\n                options: {\n                    delay: 1200,\n                    presence: \"composing\",\n                    linkPreview: false\n                },\n                text: message\n            }, {\n                headers: {\n                    \"Content-Type\": \"application/json\",\n                    apikey: this.evoApiKey\n                }\n            });\n            return response.data;\n        } catch (error) {\n            console.error(\"Erro ao enviar WhatsApp via EvolutionAPI:\", error);\n            return null;\n        }\n    }\n    /**\n   * Envia um e-mail via SMTP (Google/Nodemailer)\n   */ static async sendEmail(to, subject, html) {\n        if (!this.smtpUser || !this.smtpPass) {\n            console.warn(\"SMTP n\\xe3o configurado.\");\n            return null;\n        }\n        try {\n            const transporter = nodemailer__WEBPACK_IMPORTED_MODULE_0__.createTransport({\n                host: this.smtpHost,\n                port: this.smtpPort,\n                secure: this.smtpPort === 465,\n                auth: {\n                    user: this.smtpUser,\n                    pass: this.smtpPass\n                }\n            });\n            const info = await transporter.sendMail({\n                from: `\"Akipede - Delivery\" <${this.smtpUser}>`,\n                to,\n                subject,\n                html\n            });\n            return info;\n        } catch (error) {\n            console.error(\"Erro ao enviar E-mail:\", error);\n            return null;\n        }\n    }\n    /**\n   * Envia credenciais de boas-vindas (WhatsApp + Email)\n   */ static async sendWelcomeCredentials(nome, email, senha, celular, isEstabelecimento = true) {\n        const subject = \"Bem-vindo ao Akipede - Delivery! \\uD83D\\uDE80\";\n        const textoContexto = isEstabelecimento ? \"Seu estabelecimento foi cadastrado com sucesso no <b>Akipede - Delivery</b>.\" : \"Seu cadastro de usu\\xe1rio foi realizado com sucesso no <b>Akipede - Delivery</b>.\";\n        const message = `\n      <h1>Olá, ${nome}!</h1>\n      <p>${textoContexto}</p>\n      <p>Aqui estão suas credenciais de acesso:</p>\n      <ul>\n        <li><b>URL:</b> dashboard.akipede.com.br</li>\n        <li><b>E-mail:</b> ${email}</li>\n        <li><b>Senha:</b> ${senha}</li>\n      </ul>\n      <p>Recomendamos trocar sua senha no primeiro acesso.</p>\n      <br/>\n      <p>Atenciosamente,<br/>Equipe Akipede</p>\n    `;\n        // 1. Enviar E-mail\n        await this.sendEmail(email, subject, message);\n        // 2. Enviar WhatsApp (se disponível)\n        if (celular) {\n            const contextoWa = isEstabelecimento ? \"seu estabelecimento foi cadastrado\" : \"seu cadastro foi conclu\\xeddo\";\n            const waMessage = `🚀 *Bem-vindo ao Akipede!*\\n\\nOlá ${nome}, ${contextoWa} com sucesso.\\n\\n*Suas Credenciais:*\\n📧 Email: ${email}\\n🔑 Senha: ${senha}\\n\\nAcesse: dashboard.akipede.com.br`;\n            await this.sendWhatsApp(celular, waMessage);\n        }\n    }\n    /**\n   * Alerta de Novo Pedido\n   */ static async notifyNewOrder(phone, orderNumber, total) {\n        const message = `🔔 *Novo Pedido no Akipede!*\\n\\nPedido: #${orderNumber}\\nTotal: R$ ${total}\\n\\nAcesse o painel para gerenciar.`;\n        return this.sendWhatsApp(phone, message);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvc2VydmVyL3NlcnZpY2VzL05vdGlmaWNhdGlvblNlcnZpY2UudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTBCO0FBQ1U7QUFFN0IsTUFBTUU7O2FBQ2FDLFNBQVNDLFFBQVFDLEdBQUcsQ0FBQ0MsT0FBTzs7O2FBQzVCQyxZQUFZSCxRQUFRQyxHQUFHLENBQUNHLFVBQVU7OzthQUVsQ0MsV0FBV0wsUUFBUUMsR0FBRyxDQUFDSyxTQUFTLElBQUk7OzthQUNwQ0MsV0FBV0MsT0FBT1IsUUFBUUMsR0FBRyxDQUFDUSxTQUFTLEtBQUs7OzthQUM1Q0MsV0FBV1YsUUFBUUMsR0FBRyxDQUFDVSxTQUFTOzs7YUFDaENDLFdBQVdaLFFBQVFDLEdBQUcsQ0FBQ1ksU0FBUzs7SUFFeEQ7O0dBRUMsR0FDRCxhQUFhQyxhQUFhQyxLQUFhLEVBQUVDLE9BQWUsRUFBRTtRQUN4RCxJQUFJLENBQUMsSUFBSSxDQUFDakIsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDSSxTQUFTLEVBQUU7WUFDbkNjLFFBQVFDLElBQUksQ0FBQztZQUNiLE9BQU87UUFDVDtRQUVBLElBQUk7WUFDRiwrQ0FBK0M7WUFDL0MsTUFBTUMsYUFBYUosTUFBTUssT0FBTyxDQUFDLE9BQU87WUFDeEMsTUFBTUMsaUJBQWlCRixXQUFXRyxVQUFVLENBQUMsUUFBUUgsYUFBYSxDQUFDLEVBQUUsRUFBRUEsV0FBVyxDQUFDO1lBRW5GLE1BQU1JLFdBQVcsTUFBTTNCLDZDQUFLQSxDQUFDNEIsSUFBSSxDQUMvQixJQUFJLENBQUN6QixNQUFNLEVBQ1g7Z0JBQ0UwQixRQUFRSjtnQkFDUkssU0FBUztvQkFDUEMsT0FBTztvQkFDUEMsVUFBVTtvQkFDVkMsYUFBYTtnQkFDZjtnQkFDQUMsTUFBTWQ7WUFDUixHQUNBO2dCQUNFZSxTQUFTO29CQUNQLGdCQUFnQjtvQkFDaEJDLFFBQVEsSUFBSSxDQUFDN0IsU0FBUztnQkFDeEI7WUFDRjtZQUVGLE9BQU9vQixTQUFTVSxJQUFJO1FBQ3RCLEVBQUUsT0FBT0MsT0FBTztZQUNkakIsUUFBUWlCLEtBQUssQ0FBQyw2Q0FBNkNBO1lBQzNELE9BQU87UUFDVDtJQUNGO0lBRUE7O0dBRUMsR0FDRCxhQUFhQyxVQUFVQyxFQUFVLEVBQUVDLE9BQWUsRUFBRUMsSUFBWSxFQUFFO1FBQ2hFLElBQUksQ0FBQyxJQUFJLENBQUM1QixRQUFRLElBQUksQ0FBQyxJQUFJLENBQUNFLFFBQVEsRUFBRTtZQUNwQ0ssUUFBUUMsSUFBSSxDQUFDO1lBQ2IsT0FBTztRQUNUO1FBRUEsSUFBSTtZQUNGLE1BQU1xQixjQUFjMUMsdURBQTBCLENBQUM7Z0JBQzdDNEMsTUFBTSxJQUFJLENBQUNwQyxRQUFRO2dCQUNuQnFDLE1BQU0sSUFBSSxDQUFDbkMsUUFBUTtnQkFDbkJvQyxRQUFRLElBQUksQ0FBQ3BDLFFBQVEsS0FBSztnQkFDMUJxQyxNQUFNO29CQUNKQyxNQUFNLElBQUksQ0FBQ25DLFFBQVE7b0JBQ25Cb0MsTUFBTSxJQUFJLENBQUNsQyxRQUFRO2dCQUNyQjtZQUNGO1lBRUEsTUFBTW1DLE9BQU8sTUFBTVIsWUFBWVMsUUFBUSxDQUFDO2dCQUN0Q0MsTUFBTSxDQUFDLHNCQUFzQixFQUFFLElBQUksQ0FBQ3ZDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DMEI7Z0JBQ0FDO2dCQUNBQztZQUNGO1lBRUEsT0FBT1M7UUFDVCxFQUFFLE9BQU9iLE9BQU87WUFDZGpCLFFBQVFpQixLQUFLLENBQUMsMEJBQTBCQTtZQUN4QyxPQUFPO1FBQ1Q7SUFDRjtJQUVBOztHQUVDLEdBQ0QsYUFBYWdCLHVCQUF1QkMsSUFBWSxFQUFFQyxLQUFhLEVBQUVDLEtBQWEsRUFBRUMsT0FBZ0IsRUFBRUMsb0JBQTZCLElBQUksRUFBRTtRQUNuSSxNQUFNbEIsVUFBVTtRQUVoQixNQUFNbUIsZ0JBQWdCRCxvQkFDbEIsaUZBQ0E7UUFFSixNQUFNdkMsVUFBVSxDQUFDO2VBQ04sRUFBRW1DLEtBQUs7U0FDYixFQUFFSyxjQUFjOzs7OzJCQUlFLEVBQUVKLE1BQU07MEJBQ1QsRUFBRUMsTUFBTTs7Ozs7SUFLOUIsQ0FBQztRQUVELG1CQUFtQjtRQUNuQixNQUFNLElBQUksQ0FBQ2xCLFNBQVMsQ0FBQ2lCLE9BQU9mLFNBQVNyQjtRQUVyQyxxQ0FBcUM7UUFDckMsSUFBSXNDLFNBQVM7WUFDWCxNQUFNRyxhQUFhRixvQkFDZix1Q0FDQTtZQUVKLE1BQU1HLFlBQVksQ0FBQyxrQ0FBa0MsRUFBRVAsS0FBSyxFQUFFLEVBQUVNLFdBQVcsZ0RBQWdELEVBQUVMLE1BQU0sWUFBWSxFQUFFQyxNQUFNLG9DQUFvQyxDQUFDO1lBQzVMLE1BQU0sSUFBSSxDQUFDdkMsWUFBWSxDQUFDd0MsU0FBU0k7UUFDbkM7SUFDRjtJQUVBOztHQUVDLEdBQ0QsYUFBYUMsZUFBZTVDLEtBQWEsRUFBRTZDLFdBQW1CLEVBQUVDLEtBQWEsRUFBRTtRQUM3RSxNQUFNN0MsVUFBVSxDQUFDLHlDQUF5QyxFQUFFNEMsWUFBWSxZQUFZLEVBQUVDLE1BQU0sbUNBQW1DLENBQUM7UUFDaEksT0FBTyxJQUFJLENBQUMvQyxZQUFZLENBQUNDLE9BQU9DO0lBQ2xDO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ha2lwZWRlLWRlbGl2ZXJ5Ly4vc3JjL3NlcnZlci9zZXJ2aWNlcy9Ob3RpZmljYXRpb25TZXJ2aWNlLnRzP2Q4NzEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xuaW1wb3J0IG5vZGVtYWlsZXIgZnJvbSBcIm5vZGVtYWlsZXJcIjtcblxuZXhwb3J0IGNsYXNzIE5vdGlmaWNhdGlvblNlcnZpY2Uge1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBldm9VcmwgPSBwcm9jZXNzLmVudi5FVk9fVVJMITtcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgZXZvQXBpS2V5ID0gcHJvY2Vzcy5lbnYuRVZPX0FQSUtFWSE7XG4gIFxuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBzbXRwSG9zdCA9IHByb2Nlc3MuZW52LlNNVFBfSE9TVCB8fCBcInNtdHAuZ21haWwuY29tXCI7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IHNtdHBQb3J0ID0gTnVtYmVyKHByb2Nlc3MuZW52LlNNVFBfUE9SVCkgfHwgNTg3O1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBzbXRwVXNlciA9IHByb2Nlc3MuZW52LlNNVFBfVVNFUiE7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IHNtdHBQYXNzID0gcHJvY2Vzcy5lbnYuU01UUF9QQVNTITtcblxuICAvKipcbiAgICogRW52aWEgdW1hIG1lbnNhZ2VtIGRlIHRleHRvIHZpYSBXaGF0c0FwcCAoRXZvbHV0aW9uQVBJKVxuICAgKi9cbiAgc3RhdGljIGFzeW5jIHNlbmRXaGF0c0FwcChwaG9uZTogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuZXZvVXJsIHx8ICF0aGlzLmV2b0FwaUtleSkge1xuICAgICAgY29uc29sZS53YXJuKFwiRXZvbHV0aW9uQVBJIG7Do28gY29uZmlndXJhZGEuXCIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIExpbXBhIG8gbsO6bWVybyBwYXJhIGdhcmFudGlyIGZvcm1hdG8gY29ycmV0b1xuICAgICAgY29uc3QgY2xlYW5QaG9uZSA9IHBob25lLnJlcGxhY2UoL1xcRC9nLCBcIlwiKTtcbiAgICAgIGNvbnN0IGZvcm1hdHRlZFBob25lID0gY2xlYW5QaG9uZS5zdGFydHNXaXRoKFwiNTVcIikgPyBjbGVhblBob25lIDogYDU1JHtjbGVhblBob25lfWA7XG5cbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MucG9zdChcbiAgICAgICAgdGhpcy5ldm9VcmwsXG4gICAgICAgIHtcbiAgICAgICAgICBudW1iZXI6IGZvcm1hdHRlZFBob25lLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGRlbGF5OiAxMjAwLFxuICAgICAgICAgICAgcHJlc2VuY2U6IFwiY29tcG9zaW5nXCIsXG4gICAgICAgICAgICBsaW5rUHJldmlldzogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0ZXh0OiBtZXNzYWdlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICBhcGlrZXk6IHRoaXMuZXZvQXBpS2V5LFxuICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkVycm8gYW8gZW52aWFyIFdoYXRzQXBwIHZpYSBFdm9sdXRpb25BUEk6XCIsIGVycm9yKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbnZpYSB1bSBlLW1haWwgdmlhIFNNVFAgKEdvb2dsZS9Ob2RlbWFpbGVyKVxuICAgKi9cbiAgc3RhdGljIGFzeW5jIHNlbmRFbWFpbCh0bzogc3RyaW5nLCBzdWJqZWN0OiBzdHJpbmcsIGh0bWw6IHN0cmluZykge1xuICAgIGlmICghdGhpcy5zbXRwVXNlciB8fCAhdGhpcy5zbXRwUGFzcykge1xuICAgICAgY29uc29sZS53YXJuKFwiU01UUCBuw6NvIGNvbmZpZ3VyYWRvLlwiKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCB0cmFuc3BvcnRlciA9IG5vZGVtYWlsZXIuY3JlYXRlVHJhbnNwb3J0KHtcbiAgICAgICAgaG9zdDogdGhpcy5zbXRwSG9zdCxcbiAgICAgICAgcG9ydDogdGhpcy5zbXRwUG9ydCxcbiAgICAgICAgc2VjdXJlOiB0aGlzLnNtdHBQb3J0ID09PSA0NjUsXG4gICAgICAgIGF1dGg6IHtcbiAgICAgICAgICB1c2VyOiB0aGlzLnNtdHBVc2VyLFxuICAgICAgICAgIHBhc3M6IHRoaXMuc210cFBhc3MsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5mbyA9IGF3YWl0IHRyYW5zcG9ydGVyLnNlbmRNYWlsKHtcbiAgICAgICAgZnJvbTogYFwiQWtpcGVkZSAtIERlbGl2ZXJ5XCIgPCR7dGhpcy5zbXRwVXNlcn0+YCxcbiAgICAgICAgdG8sXG4gICAgICAgIHN1YmplY3QsXG4gICAgICAgIGh0bWwsXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvIGFvIGVudmlhciBFLW1haWw6XCIsIGVycm9yKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbnZpYSBjcmVkZW5jaWFpcyBkZSBib2FzLXZpbmRhcyAoV2hhdHNBcHAgKyBFbWFpbClcbiAgICovXG4gIHN0YXRpYyBhc3luYyBzZW5kV2VsY29tZUNyZWRlbnRpYWxzKG5vbWU6IHN0cmluZywgZW1haWw6IHN0cmluZywgc2VuaGE6IHN0cmluZywgY2VsdWxhcj86IHN0cmluZywgaXNFc3RhYmVsZWNpbWVudG86IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgY29uc3Qgc3ViamVjdCA9IFwiQmVtLXZpbmRvIGFvIEFraXBlZGUgLSBEZWxpdmVyeSEg8J+agFwiO1xuICAgIFxuICAgIGNvbnN0IHRleHRvQ29udGV4dG8gPSBpc0VzdGFiZWxlY2ltZW50byBcbiAgICAgID8gXCJTZXUgZXN0YWJlbGVjaW1lbnRvIGZvaSBjYWRhc3RyYWRvIGNvbSBzdWNlc3NvIG5vIDxiPkFraXBlZGUgLSBEZWxpdmVyeTwvYj4uXCJcbiAgICAgIDogXCJTZXUgY2FkYXN0cm8gZGUgdXN1w6FyaW8gZm9pIHJlYWxpemFkbyBjb20gc3VjZXNzbyBubyA8Yj5Ba2lwZWRlIC0gRGVsaXZlcnk8L2I+LlwiO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IGBcbiAgICAgIDxoMT5PbMOhLCAke25vbWV9ITwvaDE+XG4gICAgICA8cD4ke3RleHRvQ29udGV4dG99PC9wPlxuICAgICAgPHA+QXF1aSBlc3TDo28gc3VhcyBjcmVkZW5jaWFpcyBkZSBhY2Vzc286PC9wPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PGI+VVJMOjwvYj4gZGFzaGJvYXJkLmFraXBlZGUuY29tLmJyPC9saT5cbiAgICAgICAgPGxpPjxiPkUtbWFpbDo8L2I+ICR7ZW1haWx9PC9saT5cbiAgICAgICAgPGxpPjxiPlNlbmhhOjwvYj4gJHtzZW5oYX08L2xpPlxuICAgICAgPC91bD5cbiAgICAgIDxwPlJlY29tZW5kYW1vcyB0cm9jYXIgc3VhIHNlbmhhIG5vIHByaW1laXJvIGFjZXNzby48L3A+XG4gICAgICA8YnIvPlxuICAgICAgPHA+QXRlbmNpb3NhbWVudGUsPGJyLz5FcXVpcGUgQWtpcGVkZTwvcD5cbiAgICBgO1xuXG4gICAgLy8gMS4gRW52aWFyIEUtbWFpbFxuICAgIGF3YWl0IHRoaXMuc2VuZEVtYWlsKGVtYWlsLCBzdWJqZWN0LCBtZXNzYWdlKTtcblxuICAgIC8vIDIuIEVudmlhciBXaGF0c0FwcCAoc2UgZGlzcG9uw612ZWwpXG4gICAgaWYgKGNlbHVsYXIpIHtcbiAgICAgIGNvbnN0IGNvbnRleHRvV2EgPSBpc0VzdGFiZWxlY2ltZW50byBcbiAgICAgICAgPyBcInNldSBlc3RhYmVsZWNpbWVudG8gZm9pIGNhZGFzdHJhZG9cIiBcbiAgICAgICAgOiBcInNldSBjYWRhc3RybyBmb2kgY29uY2x1w61kb1wiO1xuXG4gICAgICBjb25zdCB3YU1lc3NhZ2UgPSBg8J+agCAqQmVtLXZpbmRvIGFvIEFraXBlZGUhKlxcblxcbk9sw6EgJHtub21lfSwgJHtjb250ZXh0b1dhfSBjb20gc3VjZXNzby5cXG5cXG4qU3VhcyBDcmVkZW5jaWFpczoqXFxu8J+TpyBFbWFpbDogJHtlbWFpbH1cXG7wn5SRIFNlbmhhOiAke3NlbmhhfVxcblxcbkFjZXNzZTogZGFzaGJvYXJkLmFraXBlZGUuY29tLmJyYDtcbiAgICAgIGF3YWl0IHRoaXMuc2VuZFdoYXRzQXBwKGNlbHVsYXIsIHdhTWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFsZXJ0YSBkZSBOb3ZvIFBlZGlkb1xuICAgKi9cbiAgc3RhdGljIGFzeW5jIG5vdGlmeU5ld09yZGVyKHBob25lOiBzdHJpbmcsIG9yZGVyTnVtYmVyOiBzdHJpbmcsIHRvdGFsOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gYPCflJQgKk5vdm8gUGVkaWRvIG5vIEFraXBlZGUhKlxcblxcblBlZGlkbzogIyR7b3JkZXJOdW1iZXJ9XFxuVG90YWw6IFIkICR7dG90YWx9XFxuXFxuQWNlc3NlIG8gcGFpbmVsIHBhcmEgZ2VyZW5jaWFyLmA7XG4gICAgcmV0dXJuIHRoaXMuc2VuZFdoYXRzQXBwKHBob25lLCBtZXNzYWdlKTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbImF4aW9zIiwibm9kZW1haWxlciIsIk5vdGlmaWNhdGlvblNlcnZpY2UiLCJldm9VcmwiLCJwcm9jZXNzIiwiZW52IiwiRVZPX1VSTCIsImV2b0FwaUtleSIsIkVWT19BUElLRVkiLCJzbXRwSG9zdCIsIlNNVFBfSE9TVCIsInNtdHBQb3J0IiwiTnVtYmVyIiwiU01UUF9QT1JUIiwic210cFVzZXIiLCJTTVRQX1VTRVIiLCJzbXRwUGFzcyIsIlNNVFBfUEFTUyIsInNlbmRXaGF0c0FwcCIsInBob25lIiwibWVzc2FnZSIsImNvbnNvbGUiLCJ3YXJuIiwiY2xlYW5QaG9uZSIsInJlcGxhY2UiLCJmb3JtYXR0ZWRQaG9uZSIsInN0YXJ0c1dpdGgiLCJyZXNwb25zZSIsInBvc3QiLCJudW1iZXIiLCJvcHRpb25zIiwiZGVsYXkiLCJwcmVzZW5jZSIsImxpbmtQcmV2aWV3IiwidGV4dCIsImhlYWRlcnMiLCJhcGlrZXkiLCJkYXRhIiwiZXJyb3IiLCJzZW5kRW1haWwiLCJ0byIsInN1YmplY3QiLCJodG1sIiwidHJhbnNwb3J0ZXIiLCJjcmVhdGVUcmFuc3BvcnQiLCJob3N0IiwicG9ydCIsInNlY3VyZSIsImF1dGgiLCJ1c2VyIiwicGFzcyIsImluZm8iLCJzZW5kTWFpbCIsImZyb20iLCJzZW5kV2VsY29tZUNyZWRlbnRpYWxzIiwibm9tZSIsImVtYWlsIiwic2VuaGEiLCJjZWx1bGFyIiwiaXNFc3RhYmVsZWNpbWVudG8iLCJ0ZXh0b0NvbnRleHRvIiwiY29udGV4dG9XYSIsIndhTWVzc2FnZSIsIm5vdGlmeU5ld09yZGVyIiwib3JkZXJOdW1iZXIiLCJ0b3RhbCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/server/services/NotificationService.ts\n");

/***/ }),

/***/ "(rsc)/./src/server/services/OrderService.ts":
/*!*********************************************!*\
  !*** ./src/server/services/OrderService.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   OrderService: () => (/* binding */ OrderService)\n/* harmony export */ });\n/* harmony import */ var _BaseService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseService */ \"(rsc)/./src/server/services/BaseService.ts\");\n/* harmony import */ var _lib_pusher__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/pusher */ \"(rsc)/./src/lib/pusher.ts\");\n/* harmony import */ var _NotificationService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NotificationService */ \"(rsc)/./src/server/services/NotificationService.ts\");\n\n\n\nclass OrderService extends _BaseService__WEBPACK_IMPORTED_MODULE_0__.BaseService {\n    /**\n   * Lista pedidos do estabelecimento com filtros de status mapeados para colunas de data\n   */ async listByStatus(status) {\n        let statusFilter = {};\n        if (status === \"PENDING\") {\n            // Recebido mas ainda não em preparo\n            statusFilter = {\n                recebido: {\n                    not: null\n                },\n                preparo: null,\n                cancelado: null\n            };\n        } else if (status === \"PREPARING\") {\n            // Em preparo mas ainda não saiu para entrega\n            statusFilter = {\n                preparo: {\n                    not: null\n                },\n                saiu_entrega: null,\n                cancelado: null\n            };\n        } else if (status === \"DELIVERING\") {\n            // Saiu para entrega mas ainda não foi entregue\n            statusFilter = {\n                saiu_entrega: {\n                    not: null\n                },\n                entregue: null,\n                cancelado: null\n            };\n        } else if (status === \"COMPLETED\") {\n            // Já foi entregue\n            statusFilter = {\n                entregue: {\n                    not: null\n                }\n            };\n        } else if (status === \"CANCELLED\") {\n            // Pedido cancelado\n            statusFilter = {\n                cancelado: {\n                    not: null\n                }\n            };\n        }\n        return await this.db.pedido.findMany({\n            where: {\n                estabelecimento: this.tenantId,\n                ...statusFilter\n            },\n            include: {\n                endereco_pedido_enderecoToendereco: true,\n                usuario_pedido_usuarioTousuario: true\n            },\n            orderBy: {\n                recebido: \"desc\"\n            }\n        });\n    }\n    /**\n   * Atualiza o status de um pedido marcando a respectiva coluna de data\n   */ async updateStatus(orderId, newStatus) {\n        const dataUpdate = {};\n        let message = \"\";\n        switch(newStatus){\n            case \"PREPARING\":\n                dataUpdate.preparo = new Date();\n                message = \"Seu pedido est\\xe1 sendo preparado!\";\n                break;\n            case \"DELIVERING\":\n                dataUpdate.saiu_entrega = new Date();\n                message = \"Seu pedido saiu para entrega!\";\n                break;\n            case \"COMPLETED\":\n                dataUpdate.entregue = new Date();\n                message = \"Seu pedido foi entregue! Bom apetite.\";\n                break;\n            case \"CANCELLED\":\n                dataUpdate.cancelado = new Date();\n                message = \"Seu pedido foi cancelado.\";\n                break;\n        }\n        const order = await this.db.pedido.update({\n            where: {\n                id_pedido: orderId,\n                estabelecimento: this.tenantId\n            },\n            data: dataUpdate,\n            include: {\n                usuario_pedido_usuarioTousuario: true\n            }\n        });\n        // 1. Notifica via Pusher (para o painel administrativo)\n        await (0,_lib_pusher__WEBPACK_IMPORTED_MODULE_1__.triggerRealtime)(this.tenantId, \"order_updated\", {\n            ...order,\n            status: newStatus\n        });\n        // 2. Notifica via WhatsApp\n        if (order.usuario_pedido_usuarioTousuario?.celular && message) {\n            await _NotificationService__WEBPACK_IMPORTED_MODULE_2__.NotificationService.sendWhatsApp(order.usuario_pedido_usuarioTousuario.celular, message);\n        }\n        return order;\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvc2VydmVyL3NlcnZpY2VzL09yZGVyU2VydmljZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQTRDO0FBQ0c7QUFDYTtBQUVyRCxNQUFNRyxxQkFBcUJILHFEQUFXQTtJQUMzQzs7R0FFQyxHQUNELE1BQU1JLGFBQWFDLE1BQWUsRUFBRTtRQUNsQyxJQUFJQyxlQUFvQixDQUFDO1FBRXpCLElBQUlELFdBQVcsV0FBVztZQUN4QixvQ0FBb0M7WUFDcENDLGVBQWU7Z0JBQUVDLFVBQVU7b0JBQUVDLEtBQUs7Z0JBQUs7Z0JBQUdDLFNBQVM7Z0JBQU1DLFdBQVc7WUFBSztRQUMzRSxPQUFPLElBQUlMLFdBQVcsYUFBYTtZQUNqQyw2Q0FBNkM7WUFDN0NDLGVBQWU7Z0JBQUVHLFNBQVM7b0JBQUVELEtBQUs7Z0JBQUs7Z0JBQUdHLGNBQWM7Z0JBQU1ELFdBQVc7WUFBSztRQUMvRSxPQUFPLElBQUlMLFdBQVcsY0FBYztZQUNsQywrQ0FBK0M7WUFDL0NDLGVBQWU7Z0JBQUVLLGNBQWM7b0JBQUVILEtBQUs7Z0JBQUs7Z0JBQUdJLFVBQVU7Z0JBQU1GLFdBQVc7WUFBSztRQUNoRixPQUFPLElBQUlMLFdBQVcsYUFBYTtZQUNqQyxrQkFBa0I7WUFDbEJDLGVBQWU7Z0JBQUVNLFVBQVU7b0JBQUVKLEtBQUs7Z0JBQUs7WUFBRTtRQUMzQyxPQUFPLElBQUlILFdBQVcsYUFBYTtZQUNqQyxtQkFBbUI7WUFDbkJDLGVBQWU7Z0JBQUVJLFdBQVc7b0JBQUVGLEtBQUs7Z0JBQUs7WUFBRTtRQUM1QztRQUVBLE9BQU8sTUFBTSxJQUFJLENBQUNLLEVBQUUsQ0FBQ0MsTUFBTSxDQUFDQyxRQUFRLENBQUM7WUFDbkNDLE9BQU87Z0JBQ0xDLGlCQUFpQixJQUFJLENBQUNDLFFBQVE7Z0JBQzlCLEdBQUdaLFlBQVk7WUFDakI7WUFDQWEsU0FBUztnQkFDUEMsb0NBQW9DO2dCQUNwQ0MsaUNBQWlDO1lBQ25DO1lBQ0FDLFNBQVM7Z0JBQUVmLFVBQVU7WUFBTztRQUM5QjtJQUNGO0lBRUE7O0dBRUMsR0FDRCxNQUFNZ0IsYUFBYUMsT0FBZSxFQUFFQyxTQUFpQixFQUFFO1FBQ3JELE1BQU1DLGFBQWtCLENBQUM7UUFDekIsSUFBSUMsVUFBVTtRQUVkLE9BQVFGO1lBQ04sS0FBSztnQkFDSEMsV0FBV2pCLE9BQU8sR0FBRyxJQUFJbUI7Z0JBQ3pCRCxVQUFVO2dCQUNWO1lBQ0YsS0FBSztnQkFDSEQsV0FBV2YsWUFBWSxHQUFHLElBQUlpQjtnQkFDOUJELFVBQVU7Z0JBQ1Y7WUFDRixLQUFLO2dCQUNIRCxXQUFXZCxRQUFRLEdBQUcsSUFBSWdCO2dCQUMxQkQsVUFBVTtnQkFDVjtZQUNGLEtBQUs7Z0JBQ0hELFdBQVdoQixTQUFTLEdBQUcsSUFBSWtCO2dCQUMzQkQsVUFBVTtnQkFDVjtRQUNKO1FBRUEsTUFBTUUsUUFBUSxNQUFNLElBQUksQ0FBQ2hCLEVBQUUsQ0FBQ0MsTUFBTSxDQUFDZ0IsTUFBTSxDQUFDO1lBQ3hDZCxPQUFPO2dCQUNMZSxXQUFXUDtnQkFDWFAsaUJBQWlCLElBQUksQ0FBQ0MsUUFBUTtZQUNoQztZQUNBYyxNQUFNTjtZQUNOUCxTQUFTO2dCQUFFRSxpQ0FBaUM7WUFBSztRQUNuRDtRQUVBLHdEQUF3RDtRQUN4RCxNQUFNcEIsNERBQWVBLENBQUMsSUFBSSxDQUFDaUIsUUFBUSxFQUFFLGlCQUFpQjtZQUFFLEdBQUdXLEtBQUs7WUFBRXhCLFFBQVFvQjtRQUFVO1FBRXBGLDJCQUEyQjtRQUMzQixJQUFJSSxNQUFNUiwrQkFBK0IsRUFBRVksV0FBV04sU0FBUztZQUM3RCxNQUFNekIscUVBQW1CQSxDQUFDZ0MsWUFBWSxDQUNwQ0wsTUFBTVIsK0JBQStCLENBQUNZLE9BQU8sRUFDN0NOO1FBRUo7UUFFQSxPQUFPRTtJQUNUO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ha2lwZWRlLWRlbGl2ZXJ5Ly4vc3JjL3NlcnZlci9zZXJ2aWNlcy9PcmRlclNlcnZpY2UudHM/OWVjOCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlU2VydmljZSB9IGZyb20gXCIuL0Jhc2VTZXJ2aWNlXCI7XG5pbXBvcnQgeyB0cmlnZ2VyUmVhbHRpbWUgfSBmcm9tIFwiQC9saWIvcHVzaGVyXCI7XG5pbXBvcnQgeyBOb3RpZmljYXRpb25TZXJ2aWNlIH0gZnJvbSBcIi4vTm90aWZpY2F0aW9uU2VydmljZVwiO1xuXG5leHBvcnQgY2xhc3MgT3JkZXJTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xuICAvKipcbiAgICogTGlzdGEgcGVkaWRvcyBkbyBlc3RhYmVsZWNpbWVudG8gY29tIGZpbHRyb3MgZGUgc3RhdHVzIG1hcGVhZG9zIHBhcmEgY29sdW5hcyBkZSBkYXRhXG4gICAqL1xuICBhc3luYyBsaXN0QnlTdGF0dXMoc3RhdHVzPzogc3RyaW5nKSB7XG4gICAgbGV0IHN0YXR1c0ZpbHRlcjogYW55ID0ge307XG4gICAgXG4gICAgaWYgKHN0YXR1cyA9PT0gXCJQRU5ESU5HXCIpIHtcbiAgICAgIC8vIFJlY2ViaWRvIG1hcyBhaW5kYSBuw6NvIGVtIHByZXBhcm9cbiAgICAgIHN0YXR1c0ZpbHRlciA9IHsgcmVjZWJpZG86IHsgbm90OiBudWxsIH0sIHByZXBhcm86IG51bGwsIGNhbmNlbGFkbzogbnVsbCB9O1xuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBcIlBSRVBBUklOR1wiKSB7XG4gICAgICAvLyBFbSBwcmVwYXJvIG1hcyBhaW5kYSBuw6NvIHNhaXUgcGFyYSBlbnRyZWdhXG4gICAgICBzdGF0dXNGaWx0ZXIgPSB7IHByZXBhcm86IHsgbm90OiBudWxsIH0sIHNhaXVfZW50cmVnYTogbnVsbCwgY2FuY2VsYWRvOiBudWxsIH07XG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IFwiREVMSVZFUklOR1wiKSB7XG4gICAgICAvLyBTYWl1IHBhcmEgZW50cmVnYSBtYXMgYWluZGEgbsOjbyBmb2kgZW50cmVndWVcbiAgICAgIHN0YXR1c0ZpbHRlciA9IHsgc2FpdV9lbnRyZWdhOiB7IG5vdDogbnVsbCB9LCBlbnRyZWd1ZTogbnVsbCwgY2FuY2VsYWRvOiBudWxsIH07XG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IFwiQ09NUExFVEVEXCIpIHtcbiAgICAgIC8vIErDoSBmb2kgZW50cmVndWVcbiAgICAgIHN0YXR1c0ZpbHRlciA9IHsgZW50cmVndWU6IHsgbm90OiBudWxsIH0gfTtcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gXCJDQU5DRUxMRURcIikge1xuICAgICAgLy8gUGVkaWRvIGNhbmNlbGFkb1xuICAgICAgc3RhdHVzRmlsdGVyID0geyBjYW5jZWxhZG86IHsgbm90OiBudWxsIH0gfTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5kYi5wZWRpZG8uZmluZE1hbnkoe1xuICAgICAgd2hlcmU6IHtcbiAgICAgICAgZXN0YWJlbGVjaW1lbnRvOiB0aGlzLnRlbmFudElkLFxuICAgICAgICAuLi5zdGF0dXNGaWx0ZXIsXG4gICAgICB9LFxuICAgICAgaW5jbHVkZToge1xuICAgICAgICBlbmRlcmVjb19wZWRpZG9fZW5kZXJlY29Ub2VuZGVyZWNvOiB0cnVlLFxuICAgICAgICB1c3VhcmlvX3BlZGlkb191c3VhcmlvVG91c3VhcmlvOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIG9yZGVyQnk6IHsgcmVjZWJpZG86IFwiZGVzY1wiIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQXR1YWxpemEgbyBzdGF0dXMgZGUgdW0gcGVkaWRvIG1hcmNhbmRvIGEgcmVzcGVjdGl2YSBjb2x1bmEgZGUgZGF0YVxuICAgKi9cbiAgYXN5bmMgdXBkYXRlU3RhdHVzKG9yZGVySWQ6IHN0cmluZywgbmV3U3RhdHVzOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkYXRhVXBkYXRlOiBhbnkgPSB7fTtcbiAgICBsZXQgbWVzc2FnZSA9IFwiXCI7XG5cbiAgICBzd2l0Y2ggKG5ld1N0YXR1cykge1xuICAgICAgY2FzZSBcIlBSRVBBUklOR1wiOlxuICAgICAgICBkYXRhVXBkYXRlLnByZXBhcm8gPSBuZXcgRGF0ZSgpO1xuICAgICAgICBtZXNzYWdlID0gXCJTZXUgcGVkaWRvIGVzdMOhIHNlbmRvIHByZXBhcmFkbyFcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiREVMSVZFUklOR1wiOlxuICAgICAgICBkYXRhVXBkYXRlLnNhaXVfZW50cmVnYSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIG1lc3NhZ2UgPSBcIlNldSBwZWRpZG8gc2FpdSBwYXJhIGVudHJlZ2EhXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIkNPTVBMRVRFRFwiOlxuICAgICAgICBkYXRhVXBkYXRlLmVudHJlZ3VlID0gbmV3IERhdGUoKTtcbiAgICAgICAgbWVzc2FnZSA9IFwiU2V1IHBlZGlkbyBmb2kgZW50cmVndWUhIEJvbSBhcGV0aXRlLlwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJDQU5DRUxMRURcIjpcbiAgICAgICAgZGF0YVVwZGF0ZS5jYW5jZWxhZG8gPSBuZXcgRGF0ZSgpO1xuICAgICAgICBtZXNzYWdlID0gXCJTZXUgcGVkaWRvIGZvaSBjYW5jZWxhZG8uXCI7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGNvbnN0IG9yZGVyID0gYXdhaXQgdGhpcy5kYi5wZWRpZG8udXBkYXRlKHtcbiAgICAgIHdoZXJlOiB7IFxuICAgICAgICBpZF9wZWRpZG86IG9yZGVySWQsXG4gICAgICAgIGVzdGFiZWxlY2ltZW50bzogdGhpcy50ZW5hbnRJZCBcbiAgICAgIH0sXG4gICAgICBkYXRhOiBkYXRhVXBkYXRlLFxuICAgICAgaW5jbHVkZTogeyB1c3VhcmlvX3BlZGlkb191c3VhcmlvVG91c3VhcmlvOiB0cnVlIH1cbiAgICB9KTtcblxuICAgIC8vIDEuIE5vdGlmaWNhIHZpYSBQdXNoZXIgKHBhcmEgbyBwYWluZWwgYWRtaW5pc3RyYXRpdm8pXG4gICAgYXdhaXQgdHJpZ2dlclJlYWx0aW1lKHRoaXMudGVuYW50SWQsIFwib3JkZXJfdXBkYXRlZFwiLCB7IC4uLm9yZGVyLCBzdGF0dXM6IG5ld1N0YXR1cyB9KTtcblxuICAgIC8vIDIuIE5vdGlmaWNhIHZpYSBXaGF0c0FwcFxuICAgIGlmIChvcmRlci51c3VhcmlvX3BlZGlkb191c3VhcmlvVG91c3VhcmlvPy5jZWx1bGFyICYmIG1lc3NhZ2UpIHtcbiAgICAgIGF3YWl0IE5vdGlmaWNhdGlvblNlcnZpY2Uuc2VuZFdoYXRzQXBwKFxuICAgICAgICBvcmRlci51c3VhcmlvX3BlZGlkb191c3VhcmlvVG91c3VhcmlvLmNlbHVsYXIsIFxuICAgICAgICBtZXNzYWdlXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBvcmRlcjtcbiAgfVxufVxuIl0sIm5hbWVzIjpbIkJhc2VTZXJ2aWNlIiwidHJpZ2dlclJlYWx0aW1lIiwiTm90aWZpY2F0aW9uU2VydmljZSIsIk9yZGVyU2VydmljZSIsImxpc3RCeVN0YXR1cyIsInN0YXR1cyIsInN0YXR1c0ZpbHRlciIsInJlY2ViaWRvIiwibm90IiwicHJlcGFybyIsImNhbmNlbGFkbyIsInNhaXVfZW50cmVnYSIsImVudHJlZ3VlIiwiZGIiLCJwZWRpZG8iLCJmaW5kTWFueSIsIndoZXJlIiwiZXN0YWJlbGVjaW1lbnRvIiwidGVuYW50SWQiLCJpbmNsdWRlIiwiZW5kZXJlY29fcGVkaWRvX2VuZGVyZWNvVG9lbmRlcmVjbyIsInVzdWFyaW9fcGVkaWRvX3VzdWFyaW9Ub3VzdWFyaW8iLCJvcmRlckJ5IiwidXBkYXRlU3RhdHVzIiwib3JkZXJJZCIsIm5ld1N0YXR1cyIsImRhdGFVcGRhdGUiLCJtZXNzYWdlIiwiRGF0ZSIsIm9yZGVyIiwidXBkYXRlIiwiaWRfcGVkaWRvIiwiZGF0YSIsImNlbHVsYXIiLCJzZW5kV2hhdHNBcHAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/server/services/OrderService.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/axios","vendor-chunks/nodemailer","vendor-chunks/pusher","vendor-chunks/asynckit","vendor-chunks/math-intrinsics","vendor-chunks/es-errors","vendor-chunks/whatwg-url","vendor-chunks/call-bind-apply-helpers","vendor-chunks/debug","vendor-chunks/get-proto","vendor-chunks/tr46","vendor-chunks/mime-db","vendor-chunks/has-symbols","vendor-chunks/gopd","vendor-chunks/function-bind","vendor-chunks/form-data","vendor-chunks/follow-redirects","vendor-chunks/proxy-from-env","vendor-chunks/node-fetch","vendor-chunks/webidl-conversions","vendor-chunks/tweetnacl","vendor-chunks/tweetnacl-util","vendor-chunks/supports-color","vendor-chunks/ms","vendor-chunks/mime-types","vendor-chunks/is-base64","vendor-chunks/hasown","vendor-chunks/has-tostringtag","vendor-chunks/has-flag","vendor-chunks/get-intrinsic","vendor-chunks/event-target-shim","vendor-chunks/es-set-tostringtag","vendor-chunks/es-object-atoms","vendor-chunks/es-define-property","vendor-chunks/dunder-proto","vendor-chunks/delayed-stream","vendor-chunks/combined-stream","vendor-chunks/abort-controller"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Forders%2Froute&page=%2Fapi%2Forders%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Forders%2Froute.ts&appDir=C%3A%5CUsers%5Csolra%5CDesktop%5Crasec%5CProjetos%5Cakipede-delivery%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Csolra%5CDesktop%5Crasec%5CProjetos%5Cakipede-delivery&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();