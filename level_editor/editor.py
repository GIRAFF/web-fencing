#!/usr/bin/python2.7
# -*- coding: utf-8 -*-

import BaseHTTPServer as bhs
import ConfigParser
import os.path as path
import mimetypes as mime
import time

CONFIG_FILE = 'editor.cfg'
HOST_NAME = 'localhost'
HOST_PORT = 8000

cfg = None

# TODO Server's responsibility is to generate .jsonp file with tile info
# TODO from tiles_dir and save generated location from POST.

class ResponseHandler(bhs.BaseHTTPRequestHandler):
    def do_HEAD(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/html')
        self.end_headers()

    def do_GET(self):
        rp = realPath(self.path)
        if path.isfile(rp):
            self.send_response(200)
            self.send_header('Content-Type', mime.guess_type(rp)[0])
            self.end_headers()
            with open(rp) as f:
                self.wfile.write(f.read())
        else:
            self.send_error(404)
            self.end_headers()

    def do_POST(self):
        pass


def realPath(p):
    rp = path.relpath('./' + p)
    rp = 'index.html' if rp == '.' else rp
    s = path.split(rp)
    if '..' in s:
        return ''
    rp = path.relpath(\
        rp if s[0] == 'tiles' else cfg.get('Host','static_dir') + rp\
    )
    print rp
    return rp


if __name__ == '__main__':
    cfg = ConfigParser.SafeConfigParser()
    cfg.read(CONFIG_FILE)

    HOST_NAME = cfg.get('Host', 'name')
    HOST_PORT = cfg.getint('Host', 'port')

    httpd = bhs.HTTPServer((HOST_NAME, HOST_PORT), ResponseHandler)
    print time.asctime(), "Server Starts - %s:%s" % \
            (HOST_NAME, HOST_PORT)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print time.asctime(), "Server Stops - %s:%s" % \
            (HOST_NAME, HOST_PORT)
