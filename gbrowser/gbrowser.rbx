require 'cgi'

c = CGI.new

r = Apache.request
r.headers_out["Location"] = c["u"]
exit Apache::REDIRECT

