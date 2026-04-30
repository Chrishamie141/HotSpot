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
exports.id = "app/api/social/profile/route";
exports.ids = ["app/api/social/profile/route"];
exports.modules = {

/***/ "(rsc)/./app/api/social/profile/route.ts":
/*!*****************************************!*\
  !*** ./app/api/social/profile/route.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_social_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/social-auth */ \"(rsc)/./lib/social-auth.ts\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n\n\n\nasync function GET() {\n    const user = await (0,_lib_social_auth__WEBPACK_IMPORTED_MODULE_1__.getOrCreateLocalUser)();\n    const [postsCount, followers, following, posts] = await Promise.all([\n        _lib_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.socialPost.count({\n            where: {\n                userId: user.id\n            }\n        }),\n        _lib_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.socialFollow.count({\n            where: {\n                followingId: user.id\n            }\n        }),\n        _lib_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.socialFollow.count({\n            where: {\n                followerId: user.id\n            }\n        }),\n        _lib_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.socialPost.findMany({\n            where: {\n                userId: user.id\n            },\n            include: {\n                media: true\n            },\n            orderBy: {\n                createdAt: \"desc\"\n            }\n        })\n    ]);\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        profile: {\n            displayName: user.socialProfile?.displayName ?? user.displayName ?? \"User\",\n            username: `@${user.socialProfile?.handle ?? \"user\"}`,\n            bio: user.socialProfile?.bio ?? \"\",\n            cityLine: user.socialProfile?.cityLine ?? \"\",\n            avatarUrl: user.socialProfile?.avatarUrl ?? \"\",\n            followers,\n            following,\n            postsCount\n        },\n        posts: posts.map((post)=>({\n                id: post.id,\n                username: `@${user.socialProfile?.handle ?? \"user\"}`,\n                avatarUrl: user.socialProfile?.avatarUrl ?? \"\",\n                venue: post.venueName ?? \"\",\n                location: post.location ?? \"\",\n                postedAt: post.createdAt.toISOString(),\n                mediaUrl: post.media[0]?.mediaUrl ?? \"\",\n                mediaType: post.media[0]?.mediaType === \"video\" ? \"video\" : \"image\",\n                caption: post.caption,\n                vibeScore: post.vibeScore ?? 0,\n                venueAverageVibe: post.vibeScore ?? 0,\n                commentsCount: 0\n            }))\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3NvY2lhbC9wcm9maWxlL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBMkM7QUFDYztBQUNuQjtBQUUvQixlQUFlRztJQUNwQixNQUFNQyxPQUFPLE1BQU1ILHNFQUFvQkE7SUFFdkMsTUFBTSxDQUFDSSxZQUFZQyxXQUFXQyxXQUFXQyxNQUFNLEdBQUcsTUFBTUMsUUFBUUMsR0FBRyxDQUFDO1FBQ2xFUiwrQ0FBTUEsQ0FBQ1MsVUFBVSxDQUFDQyxLQUFLLENBQUM7WUFBRUMsT0FBTztnQkFBRUMsUUFBUVYsS0FBS1csRUFBRTtZQUFDO1FBQUU7UUFDckRiLCtDQUFNQSxDQUFDYyxZQUFZLENBQUNKLEtBQUssQ0FBQztZQUFFQyxPQUFPO2dCQUFFSSxhQUFhYixLQUFLVyxFQUFFO1lBQUM7UUFBRTtRQUM1RGIsK0NBQU1BLENBQUNjLFlBQVksQ0FBQ0osS0FBSyxDQUFDO1lBQUVDLE9BQU87Z0JBQUVLLFlBQVlkLEtBQUtXLEVBQUU7WUFBQztRQUFFO1FBQzNEYiwrQ0FBTUEsQ0FBQ1MsVUFBVSxDQUFDUSxRQUFRLENBQUM7WUFBRU4sT0FBTztnQkFBRUMsUUFBUVYsS0FBS1csRUFBRTtZQUFDO1lBQUdLLFNBQVM7Z0JBQUVDLE9BQU87WUFBSztZQUFHQyxTQUFTO2dCQUFFQyxXQUFXO1lBQU87UUFBRTtLQUNuSDtJQUVELE9BQU92QixxREFBWUEsQ0FBQ3dCLElBQUksQ0FBQztRQUN2QkMsU0FBUztZQUNQQyxhQUFhdEIsS0FBS3VCLGFBQWEsRUFBRUQsZUFBZXRCLEtBQUtzQixXQUFXLElBQUk7WUFDcEVFLFVBQVUsQ0FBQyxDQUFDLEVBQUV4QixLQUFLdUIsYUFBYSxFQUFFRSxVQUFVLFFBQVE7WUFDcERDLEtBQUsxQixLQUFLdUIsYUFBYSxFQUFFRyxPQUFPO1lBQ2hDQyxVQUFVM0IsS0FBS3VCLGFBQWEsRUFBRUksWUFBWTtZQUMxQ0MsV0FBVzVCLEtBQUt1QixhQUFhLEVBQUVLLGFBQWE7WUFDNUMxQjtZQUNBQztZQUNBRjtRQUNGO1FBQ0FHLE9BQU9BLE1BQU15QixHQUFHLENBQUMsQ0FBQ0MsT0FBVTtnQkFDMUJuQixJQUFJbUIsS0FBS25CLEVBQUU7Z0JBQ1hhLFVBQVUsQ0FBQyxDQUFDLEVBQUV4QixLQUFLdUIsYUFBYSxFQUFFRSxVQUFVLFFBQVE7Z0JBQ3BERyxXQUFXNUIsS0FBS3VCLGFBQWEsRUFBRUssYUFBYTtnQkFDNUNHLE9BQU9ELEtBQUtFLFNBQVMsSUFBSTtnQkFDekJDLFVBQVVILEtBQUtHLFFBQVEsSUFBSTtnQkFDM0JDLFVBQVVKLEtBQUtYLFNBQVMsQ0FBQ2dCLFdBQVc7Z0JBQ3BDQyxVQUFVTixLQUFLYixLQUFLLENBQUMsRUFBRSxFQUFFbUIsWUFBWTtnQkFDckNDLFdBQVdQLEtBQUtiLEtBQUssQ0FBQyxFQUFFLEVBQUVvQixjQUFjLFVBQVUsVUFBVTtnQkFDNURDLFNBQVNSLEtBQUtRLE9BQU87Z0JBQ3JCQyxXQUFXVCxLQUFLUyxTQUFTLElBQUk7Z0JBQzdCQyxrQkFBa0JWLEtBQUtTLFNBQVMsSUFBSTtnQkFDcENFLGVBQWU7WUFDakI7SUFDRjtBQUNGIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGNocmlzXFxEZXNrdG9wXFxIb3RTcG90XFxIb3RTcG90XFxhcHBcXGFwaVxcc29jaWFsXFxwcm9maWxlXFxyb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcclxuaW1wb3J0IHsgZ2V0T3JDcmVhdGVMb2NhbFVzZXIgfSBmcm9tIFwiQC9saWIvc29jaWFsLWF1dGhcIjtcclxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSBcIkAvbGliL3ByaXNtYVwiO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVCgpIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0T3JDcmVhdGVMb2NhbFVzZXIoKTtcclxuXHJcbiAgY29uc3QgW3Bvc3RzQ291bnQsIGZvbGxvd2VycywgZm9sbG93aW5nLCBwb3N0c10gPSBhd2FpdCBQcm9taXNlLmFsbChbXHJcbiAgICBwcmlzbWEuc29jaWFsUG9zdC5jb3VudCh7IHdoZXJlOiB7IHVzZXJJZDogdXNlci5pZCB9IH0pLFxyXG4gICAgcHJpc21hLnNvY2lhbEZvbGxvdy5jb3VudCh7IHdoZXJlOiB7IGZvbGxvd2luZ0lkOiB1c2VyLmlkIH0gfSksXHJcbiAgICBwcmlzbWEuc29jaWFsRm9sbG93LmNvdW50KHsgd2hlcmU6IHsgZm9sbG93ZXJJZDogdXNlci5pZCB9IH0pLFxyXG4gICAgcHJpc21hLnNvY2lhbFBvc3QuZmluZE1hbnkoeyB3aGVyZTogeyB1c2VySWQ6IHVzZXIuaWQgfSwgaW5jbHVkZTogeyBtZWRpYTogdHJ1ZSB9LCBvcmRlckJ5OiB7IGNyZWF0ZWRBdDogXCJkZXNjXCIgfSB9KSxcclxuICBdKTtcclxuXHJcbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcclxuICAgIHByb2ZpbGU6IHtcclxuICAgICAgZGlzcGxheU5hbWU6IHVzZXIuc29jaWFsUHJvZmlsZT8uZGlzcGxheU5hbWUgPz8gdXNlci5kaXNwbGF5TmFtZSA/PyBcIlVzZXJcIixcclxuICAgICAgdXNlcm5hbWU6IGBAJHt1c2VyLnNvY2lhbFByb2ZpbGU/LmhhbmRsZSA/PyBcInVzZXJcIn1gLFxyXG4gICAgICBiaW86IHVzZXIuc29jaWFsUHJvZmlsZT8uYmlvID8/IFwiXCIsXHJcbiAgICAgIGNpdHlMaW5lOiB1c2VyLnNvY2lhbFByb2ZpbGU/LmNpdHlMaW5lID8/IFwiXCIsXHJcbiAgICAgIGF2YXRhclVybDogdXNlci5zb2NpYWxQcm9maWxlPy5hdmF0YXJVcmwgPz8gXCJcIixcclxuICAgICAgZm9sbG93ZXJzLFxyXG4gICAgICBmb2xsb3dpbmcsXHJcbiAgICAgIHBvc3RzQ291bnQsXHJcbiAgICB9LFxyXG4gICAgcG9zdHM6IHBvc3RzLm1hcCgocG9zdCkgPT4gKHtcclxuICAgICAgaWQ6IHBvc3QuaWQsXHJcbiAgICAgIHVzZXJuYW1lOiBgQCR7dXNlci5zb2NpYWxQcm9maWxlPy5oYW5kbGUgPz8gXCJ1c2VyXCJ9YCxcclxuICAgICAgYXZhdGFyVXJsOiB1c2VyLnNvY2lhbFByb2ZpbGU/LmF2YXRhclVybCA/PyBcIlwiLFxyXG4gICAgICB2ZW51ZTogcG9zdC52ZW51ZU5hbWUgPz8gXCJcIixcclxuICAgICAgbG9jYXRpb246IHBvc3QubG9jYXRpb24gPz8gXCJcIixcclxuICAgICAgcG9zdGVkQXQ6IHBvc3QuY3JlYXRlZEF0LnRvSVNPU3RyaW5nKCksXHJcbiAgICAgIG1lZGlhVXJsOiBwb3N0Lm1lZGlhWzBdPy5tZWRpYVVybCA/PyBcIlwiLFxyXG4gICAgICBtZWRpYVR5cGU6IHBvc3QubWVkaWFbMF0/Lm1lZGlhVHlwZSA9PT0gXCJ2aWRlb1wiID8gXCJ2aWRlb1wiIDogXCJpbWFnZVwiLFxyXG4gICAgICBjYXB0aW9uOiBwb3N0LmNhcHRpb24sXHJcbiAgICAgIHZpYmVTY29yZTogcG9zdC52aWJlU2NvcmUgPz8gMCxcclxuICAgICAgdmVudWVBdmVyYWdlVmliZTogcG9zdC52aWJlU2NvcmUgPz8gMCxcclxuICAgICAgY29tbWVudHNDb3VudDogMCxcclxuICAgIH0pKSxcclxuICB9KTtcclxufVxyXG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZ2V0T3JDcmVhdGVMb2NhbFVzZXIiLCJwcmlzbWEiLCJHRVQiLCJ1c2VyIiwicG9zdHNDb3VudCIsImZvbGxvd2VycyIsImZvbGxvd2luZyIsInBvc3RzIiwiUHJvbWlzZSIsImFsbCIsInNvY2lhbFBvc3QiLCJjb3VudCIsIndoZXJlIiwidXNlcklkIiwiaWQiLCJzb2NpYWxGb2xsb3ciLCJmb2xsb3dpbmdJZCIsImZvbGxvd2VySWQiLCJmaW5kTWFueSIsImluY2x1ZGUiLCJtZWRpYSIsIm9yZGVyQnkiLCJjcmVhdGVkQXQiLCJqc29uIiwicHJvZmlsZSIsImRpc3BsYXlOYW1lIiwic29jaWFsUHJvZmlsZSIsInVzZXJuYW1lIiwiaGFuZGxlIiwiYmlvIiwiY2l0eUxpbmUiLCJhdmF0YXJVcmwiLCJtYXAiLCJwb3N0IiwidmVudWUiLCJ2ZW51ZU5hbWUiLCJsb2NhdGlvbiIsInBvc3RlZEF0IiwidG9JU09TdHJpbmciLCJtZWRpYVVybCIsIm1lZGlhVHlwZSIsImNhcHRpb24iLCJ2aWJlU2NvcmUiLCJ2ZW51ZUF2ZXJhZ2VWaWJlIiwiY29tbWVudHNDb3VudCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/social/profile/route.ts\n");

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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getOrCreateLocalUser: () => (/* binding */ getOrCreateLocalUser)\n/* harmony export */ });\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n\n\nconst COOKIE_NAME = \"hotspot_user_id\";\nasync function getOrCreateLocalUser() {\n    const cookieStore = await (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)();\n    const cookieUserId = cookieStore.get(COOKIE_NAME)?.value;\n    if (cookieUserId) {\n        const existing = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.user.findUnique({\n            where: {\n                id: cookieUserId\n            },\n            include: {\n                socialProfile: true\n            }\n        });\n        if (existing) return existing;\n    }\n    const timestamp = Date.now();\n    const handle = `user${timestamp}`;\n    const email = `${handle}@local.hotspot`;\n    const created = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.user.create({\n        data: {\n            email,\n            displayName: \"New HotSpot User\",\n            socialProfile: {\n                create: {\n                    handle,\n                    displayName: \"New HotSpot User\",\n                    bio: \"\",\n                    cityLine: \"\"\n                }\n            }\n        },\n        include: {\n            socialProfile: true\n        }\n    });\n    cookieStore.set(COOKIE_NAME, created.id, {\n        httpOnly: true,\n        sameSite: \"lax\",\n        path: \"/\"\n    });\n    return created;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc29jaWFsLWF1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQXVDO0FBQ0Q7QUFFdEMsTUFBTUUsY0FBYztBQUViLGVBQWVDO0lBQ3BCLE1BQU1DLGNBQWMsTUFBTUoscURBQU9BO0lBQ2pDLE1BQU1LLGVBQWVELFlBQVlFLEdBQUcsQ0FBQ0osY0FBY0s7SUFFbkQsSUFBSUYsY0FBYztRQUNoQixNQUFNRyxXQUFXLE1BQU1QLCtDQUFNQSxDQUFDUSxJQUFJLENBQUNDLFVBQVUsQ0FBQztZQUFFQyxPQUFPO2dCQUFFQyxJQUFJUDtZQUFhO1lBQUdRLFNBQVM7Z0JBQUVDLGVBQWU7WUFBSztRQUFFO1FBQzlHLElBQUlOLFVBQVUsT0FBT0E7SUFDdkI7SUFFQSxNQUFNTyxZQUFZQyxLQUFLQyxHQUFHO0lBQzFCLE1BQU1DLFNBQVMsQ0FBQyxJQUFJLEVBQUVILFdBQVc7SUFDakMsTUFBTUksUUFBUSxHQUFHRCxPQUFPLGNBQWMsQ0FBQztJQUV2QyxNQUFNRSxVQUFVLE1BQU1uQiwrQ0FBTUEsQ0FBQ1EsSUFBSSxDQUFDWSxNQUFNLENBQUM7UUFDdkNDLE1BQU07WUFDSkg7WUFDQUksYUFBYTtZQUNiVCxlQUFlO2dCQUNiTyxRQUFRO29CQUNOSDtvQkFDQUssYUFBYTtvQkFDYkMsS0FBSztvQkFDTEMsVUFBVTtnQkFDWjtZQUNGO1FBQ0Y7UUFDQVosU0FBUztZQUFFQyxlQUFlO1FBQUs7SUFDakM7SUFFQVYsWUFBWXNCLEdBQUcsQ0FBQ3hCLGFBQWFrQixRQUFRUixFQUFFLEVBQUU7UUFBRWUsVUFBVTtRQUFNQyxVQUFVO1FBQU9DLE1BQU07SUFBSTtJQUN0RixPQUFPVDtBQUNUIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGNocmlzXFxEZXNrdG9wXFxIb3RTcG90XFxIb3RTcG90XFxsaWJcXHNvY2lhbC1hdXRoLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvb2tpZXMgfSBmcm9tIFwibmV4dC9oZWFkZXJzXCI7XHJcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gXCJAL2xpYi9wcmlzbWFcIjtcclxuXHJcbmNvbnN0IENPT0tJRV9OQU1FID0gXCJob3RzcG90X3VzZXJfaWRcIjtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRPckNyZWF0ZUxvY2FsVXNlcigpIHtcclxuICBjb25zdCBjb29raWVTdG9yZSA9IGF3YWl0IGNvb2tpZXMoKTtcclxuICBjb25zdCBjb29raWVVc2VySWQgPSBjb29raWVTdG9yZS5nZXQoQ09PS0lFX05BTUUpPy52YWx1ZTtcclxuXHJcbiAgaWYgKGNvb2tpZVVzZXJJZCkge1xyXG4gICAgY29uc3QgZXhpc3RpbmcgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kVW5pcXVlKHsgd2hlcmU6IHsgaWQ6IGNvb2tpZVVzZXJJZCB9LCBpbmNsdWRlOiB7IHNvY2lhbFByb2ZpbGU6IHRydWUgfSB9KTtcclxuICAgIGlmIChleGlzdGluZykgcmV0dXJuIGV4aXN0aW5nO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcclxuICBjb25zdCBoYW5kbGUgPSBgdXNlciR7dGltZXN0YW1wfWA7XHJcbiAgY29uc3QgZW1haWwgPSBgJHtoYW5kbGV9QGxvY2FsLmhvdHNwb3RgO1xyXG5cclxuICBjb25zdCBjcmVhdGVkID0gYXdhaXQgcHJpc21hLnVzZXIuY3JlYXRlKHtcclxuICAgIGRhdGE6IHtcclxuICAgICAgZW1haWwsXHJcbiAgICAgIGRpc3BsYXlOYW1lOiBcIk5ldyBIb3RTcG90IFVzZXJcIixcclxuICAgICAgc29jaWFsUHJvZmlsZToge1xyXG4gICAgICAgIGNyZWF0ZToge1xyXG4gICAgICAgICAgaGFuZGxlLFxyXG4gICAgICAgICAgZGlzcGxheU5hbWU6IFwiTmV3IEhvdFNwb3QgVXNlclwiLFxyXG4gICAgICAgICAgYmlvOiBcIlwiLFxyXG4gICAgICAgICAgY2l0eUxpbmU6IFwiXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBpbmNsdWRlOiB7IHNvY2lhbFByb2ZpbGU6IHRydWUgfSxcclxuICB9KTtcclxuXHJcbiAgY29va2llU3RvcmUuc2V0KENPT0tJRV9OQU1FLCBjcmVhdGVkLmlkLCB7IGh0dHBPbmx5OiB0cnVlLCBzYW1lU2l0ZTogXCJsYXhcIiwgcGF0aDogXCIvXCIgfSk7XHJcbiAgcmV0dXJuIGNyZWF0ZWQ7XHJcbn1cclxuIl0sIm5hbWVzIjpbImNvb2tpZXMiLCJwcmlzbWEiLCJDT09LSUVfTkFNRSIsImdldE9yQ3JlYXRlTG9jYWxVc2VyIiwiY29va2llU3RvcmUiLCJjb29raWVVc2VySWQiLCJnZXQiLCJ2YWx1ZSIsImV4aXN0aW5nIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImlkIiwiaW5jbHVkZSIsInNvY2lhbFByb2ZpbGUiLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93IiwiaGFuZGxlIiwiZW1haWwiLCJjcmVhdGVkIiwiY3JlYXRlIiwiZGF0YSIsImRpc3BsYXlOYW1lIiwiYmlvIiwiY2l0eUxpbmUiLCJzZXQiLCJodHRwT25seSIsInNhbWVTaXRlIiwicGF0aCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/social-auth.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsocial%2Fprofile%2Froute&page=%2Fapi%2Fsocial%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsocial%2Fprofile%2Froute.ts&appDir=C%3A%5CUsers%5Cchris%5CDesktop%5CHotSpot%5CHotSpot%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cchris%5CDesktop%5CHotSpot%5CHotSpot&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsocial%2Fprofile%2Froute&page=%2Fapi%2Fsocial%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsocial%2Fprofile%2Froute.ts&appDir=C%3A%5CUsers%5Cchris%5CDesktop%5CHotSpot%5CHotSpot%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cchris%5CDesktop%5CHotSpot%5CHotSpot&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_chris_Desktop_HotSpot_HotSpot_app_api_social_profile_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/social/profile/route.ts */ \"(rsc)/./app/api/social/profile/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/social/profile/route\",\n        pathname: \"/api/social/profile\",\n        filename: \"route\",\n        bundlePath: \"app/api/social/profile/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\chris\\\\Desktop\\\\HotSpot\\\\HotSpot\\\\app\\\\api\\\\social\\\\profile\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_chris_Desktop_HotSpot_HotSpot_app_api_social_profile_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZzb2NpYWwlMkZwcm9maWxlJTJGcm91dGUmcGFnZT0lMkZhcGklMkZzb2NpYWwlMkZwcm9maWxlJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGc29jaWFsJTJGcHJvZmlsZSUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNjaHJpcyU1Q0Rlc2t0b3AlNUNIb3RTcG90JTVDSG90U3BvdCU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDY2hyaXMlNUNEZXNrdG9wJTVDSG90U3BvdCU1Q0hvdFNwb3QmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ2dDO0FBQzdHO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFxjaHJpc1xcXFxEZXNrdG9wXFxcXEhvdFNwb3RcXFxcSG90U3BvdFxcXFxhcHBcXFxcYXBpXFxcXHNvY2lhbFxcXFxwcm9maWxlXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9zb2NpYWwvcHJvZmlsZS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3NvY2lhbC9wcm9maWxlXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9zb2NpYWwvcHJvZmlsZS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXGNocmlzXFxcXERlc2t0b3BcXFxcSG90U3BvdFxcXFxIb3RTcG90XFxcXGFwcFxcXFxhcGlcXFxcc29jaWFsXFxcXHByb2ZpbGVcXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsocial%2Fprofile%2Froute&page=%2Fapi%2Fsocial%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsocial%2Fprofile%2Froute.ts&appDir=C%3A%5CUsers%5Cchris%5CDesktop%5CHotSpot%5CHotSpot%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cchris%5CDesktop%5CHotSpot%5CHotSpot&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsocial%2Fprofile%2Froute&page=%2Fapi%2Fsocial%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsocial%2Fprofile%2Froute.ts&appDir=C%3A%5CUsers%5Cchris%5CDesktop%5CHotSpot%5CHotSpot%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cchris%5CDesktop%5CHotSpot%5CHotSpot&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();