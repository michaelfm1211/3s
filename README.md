# 3s
3s a self-hosted screenshot service. 3s is short for "Send ScreenShot" and
does exactly that. Currently, the client script only works on macOS, although
by reading it (it is only 24 lines), anyone can get the idea of what you need
to do. A client script for X11 is underway.

### Running
This repository is a nodejs project with a shell script called `3s-mac.sh`.
All the code for the server, which will receive, store, and host the 
screenshots, is in `index.js`. The shell script, `3s-mac.sh`, is the client
that enters screeshot mode, then sends the screenshot to the server. 

#### Running the Server
First, clone the repository and run `npm install` as usual. Before you run the
server, you may want to set the environment variables `$PORT` and `$SECRET`.
`$PORT` determines which port the server uses, and is `33530` by default.
`$SECRET` sets the preshared secret that the server will use for
authentication.

#### Running the Client
Assuming you've already cloned the repository, first move the script
`3s-mac.sh` to somewhere in your path. Then, set the environment variables
`$THREESSERVER` and `$THREESSECRET` to their desired values. `$THREESSERVER`
will tell 3s to which server to send screenshots, and the value of
`$THREESSECRET` will be used when authenticating with the server.
`$THREESSECRET` must be the preshared secret that you used when setting up the
server

### Notes
- The client `3s-mac.sh` will only work on macOS, because it uses the macOS
`screencapture`, `pbcopy`, and `pbpaste` commands. The server should work on
any recent nodejs version, but has only been tested on nodejs v17.9.0. If you
want to use the client somewhere else than macOS, you will probably need to
edit the script or write your own client (it is a very simple client). 
- If you want your screenshots to be sent securely, be sure to use HTTPS. Your
client should support HTTPS if it is sane, but you may want to run the 3s
server through a reverse proxy that supports HTTPS, such as nginx, stunnel, or
socat.
- The server will only make a weak attempt to strip images of EXIF data. If
this matters to you, you should use/make a client that strips EXIF data before
it is sent to the server.

