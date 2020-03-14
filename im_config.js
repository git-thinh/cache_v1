let im_config = function im_config() {
    const FS = require('fs');

    this.get = function () {
        return new Promise(function (resolve, reject) {
            let file, pol_v1, cmd_install, select_top, sql_connect;

            file = './config/cmd_install.json';
            if (FS.existsSync(file)) try { cmd_install = require(file); } catch (e) { ; }

            file = './config/pol_v1.json';
            if (FS.existsSync(file)) try { pol_v1 = require(file); } catch (e) { ; }

            file = './config/select_top.json';
            if (FS.existsSync(file)) try { select_top = require(file); } catch (e) { ; }

            file = './config/sql_connect.json';
            if (FS.existsSync(file)) try { sql_connect = require(file); } catch (e) { ; }

            //console.log('cmd_install = ', cmd_install);
            //console.log('select_top = ', select_top);
            //console.log('sql_connect = ', sql_connect);

            if (pol_v1) {
                pol_v1.forEach(cf => {
                    cf.cmd_install = '';
                    if (cmd_install && cmd_install[cf.name]) cf.cmd_install = cmd_install[cf.name];

                    cf.select_top = '';
                    if (select_top && select_top[cf.name]) cf.select_top = select_top[cf.name];

                    cf.sql_connect = null;
                    if (sql_connect && sql_connect[cf.scope]) cf.sql_connect = sql_connect[cf.scope];

                    file = './config/sql/' + cf.name + '.sql';
                    cf.sql_select = null;
                    if (FS.existsSync(file)) try { cf.sql_select = FS.readFileSync(file).toString('utf8').trim(); } catch (e) { ; }

                    file = './config/schema/' + cf.name + '.json';
                    cf.schema = null;
                    if (FS.existsSync(file)) try { cf.schema = require(file); } catch (e) { ; }

                    file = './config/valid_add/' + cf.name + '.json';
                    cf.valid_add = null;
                    if (FS.existsSync(file)) try { cf.valid_add = require(file); } catch (e) { ; }
                });

                //console.log('pol_v1 = ', pol_v1[pol_v1.length - 1]);

                resolve(pol_v1);
            } else resolve([]);
        });
    };
};

im_config.instance = null;
im_config.getInstance = function () {
    if (this.instance === null) this.instance = new im_config();
    return this.instance;
};
module.exports = im_config.getInstance();