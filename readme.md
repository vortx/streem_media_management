docker run -it -d --name nginx_stream -p 1935:1935 -p 81:80  -v /home/vortx/video:/it vortxman:streem_control '/bin/bash'