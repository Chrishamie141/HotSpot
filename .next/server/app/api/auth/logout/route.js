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
exports.id = "app/api/auth/logout/route";
exports.ids = ["app/api/auth/logout/route"];
exports.modules = {

/***/ "(rsc)/./app/api/auth/logout/route.ts":
/*!**************************************!*\
  !*** ./app/api/auth/logout/route.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_social_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/social-auth */ \"(rsc)/./lib/social-auth.ts\");\n\n\nasync function POST() {\n    await (0,_lib_social_auth__WEBPACK_IMPORTED_MODULE_1__.clearAuthCookie)();\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        ok: true\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvbG9nb3V0L3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUEyQztBQUNTO0FBRTdDLGVBQWVFO0lBQ3BCLE1BQU1ELGlFQUFlQTtJQUNyQixPQUFPRCxxREFBWUEsQ0FBQ0csSUFBSSxDQUFDO1FBQUVDLElBQUk7SUFBSztBQUN0QyIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxjaHJpc1xcRGVza3RvcFxcSG90U3BvdFxcSG90U3BvdFxcYXBwXFxhcGlcXGF1dGhcXGxvZ291dFxccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCI7XHJcbmltcG9ydCB7IGNsZWFyQXV0aENvb2tpZSB9IGZyb20gXCJAL2xpYi9zb2NpYWwtYXV0aFwiO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QoKSB7XHJcbiAgYXdhaXQgY2xlYXJBdXRoQ29va2llKCk7XHJcbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgb2s6IHRydWUgfSk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImNsZWFyQXV0aENvb2tpZSIsIlBPU1QiLCJqc29uIiwib2siXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/logout/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) {\n    globalForPrisma.prisma = prisma;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE4QztBQUU5QyxNQUFNQyxrQkFBa0JDO0FBRWpCLE1BQU1DLFNBQVNGLGdCQUFnQkUsTUFBTSxJQUFJLElBQUlILHdEQUFZQSxHQUFHO0FBRW5FLElBQUlJLElBQXFDLEVBQUU7SUFDekNILGdCQUFnQkUsTUFBTSxHQUFHQTtBQUMzQiIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxjaHJpc1xcRGVza3RvcFxcSG90U3BvdFxcSG90U3BvdFxcbGliXFxwcmlzbWEudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XHJcblxyXG5jb25zdCBnbG9iYWxGb3JQcmlzbWEgPSBnbG9iYWxUaGlzIGFzIHVua25vd24gYXMgeyBwcmlzbWE6IFByaXNtYUNsaWVudCB8IHVuZGVmaW5lZCB9O1xyXG5cclxuZXhwb3J0IGNvbnN0IHByaXNtYSA9IGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPz8gbmV3IFByaXNtYUNsaWVudCgpO1xyXG5cclxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xyXG4gIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPSBwcmlzbWE7XHJcbn1cclxuIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImdsb2JhbEZvclByaXNtYSIsImdsb2JhbFRoaXMiLCJwcmlzbWEiLCJwcm9jZXNzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ }),

/***/ "(rsc)/./lib/social-auth.ts":
/*!****************************!*\
  !*** ./lib/social-auth.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AUTH_COOKIE_NAME: () => (/* binding */ AUTH_COOKIE_NAME),\n/* harmony export */   clearAuthCookie: () => (/* binding */ clearAuthCookie),\n/* harmony export */   getCurrentUser: () => (/* binding */ getCurrentUser),\n/* harmony export */   getOrCreateLocalUser: () => (/* binding */ getOrCreateLocalUser),\n/* harmony export */   requireCurrentUser: () => (/* binding */ requireCurrentUser),\n/* harmony export */   setAuthCookie: () => (/* binding */ setAuthCookie)\n/* harmony export */ });\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n\n\nconst AUTH_COOKIE_NAME = \"hotspot_user_id\";\nfunction getAuthCookieOptions() {\n    return {\n        httpOnly: true,\n        sameSite: \"lax\",\n        path: \"/\",\n        secure: \"development\" === \"production\"\n    };\n}\nasync function setAuthCookie(userId) {\n    const cookieStore = await (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)();\n    cookieStore.set(AUTH_COOKIE_NAME, userId, getAuthCookieOptions());\n}\nasync function clearAuthCookie() {\n    const cookieStore = await (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)();\n    cookieStore.set(AUTH_COOKIE_NAME, \"\", {\n        ...getAuthCookieOptions(),\n        maxAge: 0\n    });\n}\nasync function getCurrentUser() {\n    const cookieStore = await (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)();\n    const cookieUserId = cookieStore.get(AUTH_COOKIE_NAME)?.value;\n    if (!cookieUserId) return null;\n    return _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.user.findUnique({\n        where: {\n            id: cookieUserId\n        },\n        include: {\n            socialProfile: true\n        }\n    });\n}\nasync function requireCurrentUser() {\n    const user = await getCurrentUser();\n    if (!user) return null;\n    return user;\n}\n// retained for development compatibility only\nasync function getOrCreateLocalUser() {\n    const existing = await getCurrentUser();\n    if (existing) return existing;\n    const timestamp = Date.now();\n    const handle = `user${timestamp}`;\n    const email = `${handle}@local.hotspot`;\n    const created = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.user.create({\n        data: {\n            email,\n            displayName: \"New HotSpot User\",\n            socialProfile: {\n                create: {\n                    handle,\n                    displayName: \"New HotSpot User\",\n                    bio: \"\",\n                    cityLine: \"\",\n                    onboardingCompleted: false\n                }\n            }\n        },\n        include: {\n            socialProfile: true\n        }\n    });\n    await setAuthCookie(created.id);\n    return created;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc29jaWFsLWF1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBdUM7QUFDRDtBQUUvQixNQUFNRSxtQkFBbUIsa0JBQWtCO0FBRWxELFNBQVNDO0lBQ1AsT0FBTztRQUNMQyxVQUFVO1FBQ1ZDLFVBQVU7UUFDVkMsTUFBTTtRQUNOQyxRQUFRQyxrQkFBeUI7SUFDbkM7QUFDRjtBQUVPLGVBQWVDLGNBQWNDLE1BQWM7SUFDaEQsTUFBTUMsY0FBYyxNQUFNWCxxREFBT0E7SUFDakNXLFlBQVlDLEdBQUcsQ0FBQ1Ysa0JBQWtCUSxRQUFRUDtBQUM1QztBQUVPLGVBQWVVO0lBQ3BCLE1BQU1GLGNBQWMsTUFBTVgscURBQU9BO0lBQ2pDVyxZQUFZQyxHQUFHLENBQUNWLGtCQUFrQixJQUFJO1FBQ3BDLEdBQUdDLHNCQUFzQjtRQUN6QlcsUUFBUTtJQUNWO0FBQ0Y7QUFFTyxlQUFlQztJQUNwQixNQUFNSixjQUFjLE1BQU1YLHFEQUFPQTtJQUNqQyxNQUFNZ0IsZUFBZUwsWUFBWU0sR0FBRyxDQUFDZixtQkFBbUJnQjtJQUN4RCxJQUFJLENBQUNGLGNBQWMsT0FBTztJQUUxQixPQUFPZiwrQ0FBTUEsQ0FBQ2tCLElBQUksQ0FBQ0MsVUFBVSxDQUFDO1FBQzVCQyxPQUFPO1lBQUVDLElBQUlOO1FBQWE7UUFDMUJPLFNBQVM7WUFBRUMsZUFBZTtRQUFLO0lBQ2pDO0FBQ0Y7QUFFTyxlQUFlQztJQUNwQixNQUFNTixPQUFPLE1BQU1KO0lBQ25CLElBQUksQ0FBQ0ksTUFBTSxPQUFPO0lBQ2xCLE9BQU9BO0FBQ1Q7QUFFQSw4Q0FBOEM7QUFDdkMsZUFBZU87SUFDcEIsTUFBTUMsV0FBVyxNQUFNWjtJQUN2QixJQUFJWSxVQUFVLE9BQU9BO0lBRXJCLE1BQU1DLFlBQVlDLEtBQUtDLEdBQUc7SUFDMUIsTUFBTUMsU0FBUyxDQUFDLElBQUksRUFBRUgsV0FBVztJQUNqQyxNQUFNSSxRQUFRLEdBQUdELE9BQU8sY0FBYyxDQUFDO0lBRXZDLE1BQU1FLFVBQVUsTUFBTWhDLCtDQUFNQSxDQUFDa0IsSUFBSSxDQUFDZSxNQUFNLENBQUM7UUFDdkNDLE1BQU07WUFDSkg7WUFDQUksYUFBYTtZQUNiWixlQUFlO2dCQUNiVSxRQUFRO29CQUNOSDtvQkFDQUssYUFBYTtvQkFDYkMsS0FBSztvQkFDTEMsVUFBVTtvQkFDVkMscUJBQXFCO2dCQUN2QjtZQUNGO1FBQ0Y7UUFDQWhCLFNBQVM7WUFBRUMsZUFBZTtRQUFLO0lBQ2pDO0lBRUEsTUFBTWYsY0FBY3dCLFFBQVFYLEVBQUU7SUFDOUIsT0FBT1c7QUFDVCIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxjaHJpc1xcRGVza3RvcFxcSG90U3BvdFxcSG90U3BvdFxcbGliXFxzb2NpYWwtYXV0aC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb29raWVzIH0gZnJvbSBcIm5leHQvaGVhZGVyc1wiO1xyXG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tIFwiQC9saWIvcHJpc21hXCI7XHJcblxyXG5leHBvcnQgY29uc3QgQVVUSF9DT09LSUVfTkFNRSA9IFwiaG90c3BvdF91c2VyX2lkXCI7XHJcblxyXG5mdW5jdGlvbiBnZXRBdXRoQ29va2llT3B0aW9ucygpIHtcclxuICByZXR1cm4ge1xyXG4gICAgaHR0cE9ubHk6IHRydWUsXHJcbiAgICBzYW1lU2l0ZTogXCJsYXhcIiBhcyBjb25zdCxcclxuICAgIHBhdGg6IFwiL1wiLFxyXG4gICAgc2VjdXJlOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIsXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldEF1dGhDb29raWUodXNlcklkOiBzdHJpbmcpIHtcclxuICBjb25zdCBjb29raWVTdG9yZSA9IGF3YWl0IGNvb2tpZXMoKTtcclxuICBjb29raWVTdG9yZS5zZXQoQVVUSF9DT09LSUVfTkFNRSwgdXNlcklkLCBnZXRBdXRoQ29va2llT3B0aW9ucygpKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNsZWFyQXV0aENvb2tpZSgpIHtcclxuICBjb25zdCBjb29raWVTdG9yZSA9IGF3YWl0IGNvb2tpZXMoKTtcclxuICBjb29raWVTdG9yZS5zZXQoQVVUSF9DT09LSUVfTkFNRSwgXCJcIiwge1xyXG4gICAgLi4uZ2V0QXV0aENvb2tpZU9wdGlvbnMoKSxcclxuICAgIG1heEFnZTogMCxcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEN1cnJlbnRVc2VyKCkge1xyXG4gIGNvbnN0IGNvb2tpZVN0b3JlID0gYXdhaXQgY29va2llcygpO1xyXG4gIGNvbnN0IGNvb2tpZVVzZXJJZCA9IGNvb2tpZVN0b3JlLmdldChBVVRIX0NPT0tJRV9OQU1FKT8udmFsdWU7XHJcbiAgaWYgKCFjb29raWVVc2VySWQpIHJldHVybiBudWxsO1xyXG5cclxuICByZXR1cm4gcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7XHJcbiAgICB3aGVyZTogeyBpZDogY29va2llVXNlcklkIH0sXHJcbiAgICBpbmNsdWRlOiB7IHNvY2lhbFByb2ZpbGU6IHRydWUgfSxcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmVDdXJyZW50VXNlcigpIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudFVzZXIoKTtcclxuICBpZiAoIXVzZXIpIHJldHVybiBudWxsO1xyXG4gIHJldHVybiB1c2VyO1xyXG59XHJcblxyXG4vLyByZXRhaW5lZCBmb3IgZGV2ZWxvcG1lbnQgY29tcGF0aWJpbGl0eSBvbmx5XHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRPckNyZWF0ZUxvY2FsVXNlcigpIHtcclxuICBjb25zdCBleGlzdGluZyA9IGF3YWl0IGdldEN1cnJlbnRVc2VyKCk7XHJcbiAgaWYgKGV4aXN0aW5nKSByZXR1cm4gZXhpc3Rpbmc7XHJcblxyXG4gIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XHJcbiAgY29uc3QgaGFuZGxlID0gYHVzZXIke3RpbWVzdGFtcH1gO1xyXG4gIGNvbnN0IGVtYWlsID0gYCR7aGFuZGxlfUBsb2NhbC5ob3RzcG90YDtcclxuXHJcbiAgY29uc3QgY3JlYXRlZCA9IGF3YWl0IHByaXNtYS51c2VyLmNyZWF0ZSh7XHJcbiAgICBkYXRhOiB7XHJcbiAgICAgIGVtYWlsLFxyXG4gICAgICBkaXNwbGF5TmFtZTogXCJOZXcgSG90U3BvdCBVc2VyXCIsXHJcbiAgICAgIHNvY2lhbFByb2ZpbGU6IHtcclxuICAgICAgICBjcmVhdGU6IHtcclxuICAgICAgICAgIGhhbmRsZSxcclxuICAgICAgICAgIGRpc3BsYXlOYW1lOiBcIk5ldyBIb3RTcG90IFVzZXJcIixcclxuICAgICAgICAgIGJpbzogXCJcIixcclxuICAgICAgICAgIGNpdHlMaW5lOiBcIlwiLFxyXG4gICAgICAgICAgb25ib2FyZGluZ0NvbXBsZXRlZDogZmFsc2UsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBpbmNsdWRlOiB7IHNvY2lhbFByb2ZpbGU6IHRydWUgfSxcclxuICB9KTtcclxuXHJcbiAgYXdhaXQgc2V0QXV0aENvb2tpZShjcmVhdGVkLmlkKTtcclxuICByZXR1cm4gY3JlYXRlZDtcclxufVxyXG4iXSwibmFtZXMiOlsiY29va2llcyIsInByaXNtYSIsIkFVVEhfQ09PS0lFX05BTUUiLCJnZXRBdXRoQ29va2llT3B0aW9ucyIsImh0dHBPbmx5Iiwic2FtZVNpdGUiLCJwYXRoIiwic2VjdXJlIiwicHJvY2VzcyIsInNldEF1dGhDb29raWUiLCJ1c2VySWQiLCJjb29raWVTdG9yZSIsInNldCIsImNsZWFyQXV0aENvb2tpZSIsIm1heEFnZSIsImdldEN1cnJlbnRVc2VyIiwiY29va2llVXNlcklkIiwiZ2V0IiwidmFsdWUiLCJ1c2VyIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwiaWQiLCJpbmNsdWRlIiwic29jaWFsUHJvZmlsZSIsInJlcXVpcmVDdXJyZW50VXNlciIsImdldE9yQ3JlYXRlTG9jYWxVc2VyIiwiZXhpc3RpbmciLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93IiwiaGFuZGxlIiwiZW1haWwiLCJjcmVhdGVkIiwiY3JlYXRlIiwiZGF0YSIsImRpc3BsYXlOYW1lIiwiYmlvIiwiY2l0eUxpbmUiLCJvbmJvYXJkaW5nQ29tcGxldGVkIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/social-auth.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogout%2Froute&page=%2Fapi%2Fauth%2Flogout%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogout%2Froute.ts&appDir=C%3A%5CUsers%5Cchris%5CDesktop%5CHotSpot%5CHotSpot%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cchris%5CDesktop%5CHotSpot%5CHotSpot&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogout%2Froute&page=%2Fapi%2Fauth%2Flogout%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogout%2Froute.ts&appDir=C%3A%5CUsers%5Cchris%5CDesktop%5CHotSpot%5CHotSpot%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cchris%5CDesktop%5CHotSpot%5CHotSpot&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_chris_Desktop_HotSpot_HotSpot_app_api_auth_logout_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/logout/route.ts */ \"(rsc)/./app/api/auth/logout/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/logout/route\",\n        pathname: \"/api/auth/logout\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/logout/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\chris\\\\Desktop\\\\HotSpot\\\\HotSpot\\\\app\\\\api\\\\auth\\\\logout\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_chris_Desktop_HotSpot_HotSpot_app_api_auth_logout_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGbG9nb3V0JTJGcm91dGUmcGFnZT0lMkZhcGklMkZhdXRoJTJGbG9nb3V0JTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGYXV0aCUyRmxvZ291dCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNjaHJpcyU1Q0Rlc2t0b3AlNUNIb3RTcG90JTVDSG90U3BvdCU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDY2hyaXMlNUNEZXNrdG9wJTVDSG90U3BvdCU1Q0hvdFNwb3QmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQzZCO0FBQzFHO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFxjaHJpc1xcXFxEZXNrdG9wXFxcXEhvdFNwb3RcXFxcSG90U3BvdFxcXFxhcHBcXFxcYXBpXFxcXGF1dGhcXFxcbG9nb3V0XFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hdXRoL2xvZ291dC9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2F1dGgvbG9nb3V0XCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL2xvZ291dC9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXGNocmlzXFxcXERlc2t0b3BcXFxcSG90U3BvdFxcXFxIb3RTcG90XFxcXGFwcFxcXFxhcGlcXFxcYXV0aFxcXFxsb2dvdXRcXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogout%2Froute&page=%2Fapi%2Fauth%2Flogout%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogout%2Froute.ts&appDir=C%3A%5CUsers%5Cchris%5CDesktop%5CHotSpot%5CHotSpot%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cchris%5CDesktop%5CHotSpot%5CHotSpot&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/client");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogout%2Froute&page=%2Fapi%2Fauth%2Flogout%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogout%2Froute.ts&appDir=C%3A%5CUsers%5Cchris%5CDesktop%5CHotSpot%5CHotSpot%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cchris%5CDesktop%5CHotSpot%5CHotSpot&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();