
### Docker hub
```
vortxman/stream_control
```

### run container
```
docker run -it -d --name nginx_stream -p 1935:1935 -p 81:80  -v /home/vortx/video:/it vortxman/stream_control '/bin/bash'
```
