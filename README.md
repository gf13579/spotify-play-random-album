# spotify-play-random-album

This script plays a random album from the your Spotify library. It fetches your saved albums, selects one at random, and starts playback.
 
Run the code in the browser's JavaScript console in a tab with https://open.spotify.com/ open.
 
After running the code once in the browser's JavaScript Console, repeat the call to `playRandomAlbum()` as required.


## Usage/Examples

1. Open Spotify in a web browser
2. Open the Dev Tools (F12) and go to the JavaScript console
3. Paste the contents of index.js in
4. Observe that you're now listening to a random album from your collection
5. Type `playRandomAlbum()` to play another random album

## Bookmarklet

To run as a bookmark in a tab with open.spotify.com open:

```javascript
javascript:(function(){const t=encodeURIComponent(JSON.stringify({filters:["Albums"],order:null,textFilter:"",limit:1e3,offset:0,flatten:!1,expandedFolders:[],folderUri:null,includeFoldersWhenFlattening:!0})),e=encodeURIComponent(JSON.stringify({persistedQuery:{version:1,sha256Hash:"e25e473b160efdd4ababa7d98aa909ce0e5ab9c49c81f6d040da077a09e34ab3"}}));(async function(){try{const n=JSON.parse(document.querySelector("#session").textContent).accessToken,r=await fetch("https://api-partner.spotify.com/pathfinder/v1/query?operationName=libraryV3&variables="+t+"&extensions="+e,{headers:{Authorization:"Bearer "+n}});if(!r.ok)throw new Error(`HTTP error! status: ${r.status}`);const a=(await r.json()).data.me.libraryV3.items;if(!a||0===a.length)throw new Error("No albums found in the library");const o=a[Math.floor(Math.random()*a.length)];await fetch("https://api.spotify.com/v1/me/player/play",{method:"PUT",headers:{Authorization:`Bearer ${n}`,"Content-Type":"application/json"},body:JSON.stringify({context_uri:o.item.data.uri})})}catch(t){console.error("Error:",t)}})()})();
```

## To Do

- Support queuing *x* random albums at once
- Update the DOM to add a button that triggers `playRandomAlbum()`


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Related

- https://developer.spotify.com/documentation/web-api/reference/