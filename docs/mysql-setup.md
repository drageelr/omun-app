# MySQL Setup

## Install MySQL Server and WorkBench

### Windows
- Go to this [link](https://dev.mysql.com/downloads/installer/) and download the installer for Windows
- Run the installer and in the `Setup Type` screen, select the default option

### Ubuntu
- Update apt: `sudo apt update`
- Instal mysql-server: `sudo apt install mysql-server`
- Secure mysql-server: `sudo mysql_secure_installation`
  - Follow the steps
  - Don't activate `VALIDATE PASSWORD COMPONENT`
- Download mysql workbench from this [link](https://dev.mysql.com/downloads/workbench/) for ubuntu
- Run the downloaded file to install.

## Add New User to MySQL
- Run the command `mysql` (or `mysql -u root -p` if the preceding fails) on Ubuntu terminal OR Windows powershell/command prompt
- Then run the series of commands sequentially:
```
CREATE USER 'omun'@'localhost' IDENTIFIED WITH mysql_native_password BY 'omun123';
GRANT ALL PRIVILEGES ON *.* TO 'omun'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```
- Now close the terminal

## Configure New Connection in MySQL WorkBench
- Open MySQL WorkBench
- Create a new connection
  - Connection Name: Anything
  - Hostname: `127.0.0.1`
  - Port: `13306`
  - Username: `omun`
  - Password: `omun123`
    - This will be prompted to you when you run the connection
- Test the connection, if all good continue
- Press OK

## Import DB Schema to MySQL
- Drop the schema if you already created it.
- Run the following command in the directory of this folder:
```
mysql -u omun -p omun_db < omun_db.sql
```

## Export DB Schema to MySQL
- Run the following command to export db schema without data
```
mysqldump -h localhost -u omun -p --no-data omun_db > omun_db.sql
```