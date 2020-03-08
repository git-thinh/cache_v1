const fs = require('fs');
const _sql_select_top = 'top 5';
//const stopWatch = require("performance-now");

const API_TOKEN = 'eb976d531188435ea006fce8769c53d5';
const sql_connect = {
    pol: {
        server: '192.168.10.54',
        authentication: { type: 'default', options: { userName: 'sa', password: 'dev@123' } },
        options: { database: 'POL_20191230_020320' }
    },
    pos: {
        server: '192.168.10.37',
        authentication: { type: 'default', options: { userName: 'mobile', password: 'HjdbFV7jos9bc6lw' } },
        options: { database: 'Release_FB51_App' }
    }
};

const API = {};

const cacheSetupDB_Scripts = () => {
    const sql = {
        POL_PAWN: "SELECT " + _sql_select_top + " *,isnull( (select * from [SplitStringToTable](str_url,'&')),'') as str_campaign FROM mobile.pol_pawn order by id asc",
        POL_CUSTOMER: "SELECT " + _sql_select_top + " * FROM mobile.pol_customer order by id desc",
        //POL_CUSTOMER: "SELECT top 5000 * FROM mobile.pol_customer order by id desc",
        GROUP: "SELECT \
                    GroupID as id \
                    ,ParentID as parent_id \
                    ,Code as str_code \
                    ,[Name] as str_name \
                    ,[Status] as int_status \
            FROM [pos].[Group] where IsShop=1 or GroupID=44 or GroupID=58",
        POS_SYS_CONFIG: "SELECT \
                            0 as id \
                        ,[Code] as str_code \
                        ,[Type] as str_type \
                        ,[Value] as str_value \
                        ,[Name] as str_name \
                        ,[Status] as int_status \
                        FROM [pos].[SysConfig] \
                        where Type='PawnOnlineOption'",
        SHOP: "select \
                    shopid as id \
                    , code \
                    , [name] as str_name \
            from pos.shopdetail",
        REGION: "select \
                        [RegionID] as id \
                        ,[Name] as str_name \
                        ,isnull([ParentID],0) as int_pid \
                        , isnull((select [Name] from pos.region as b where b.[RegionID] = a.[ParentID] ),'') as str_parent_name \
                from pos.region as a where [status]=1",
        USER: "SELECT  u.UserID as id, \
                ISNULL(u.CalloutToken,'') as str_call_out_tooken, \
                u.ApproveLevel as int_approve_level, \
                ISNULL(u.UserPosition,0) as str_user_position, \
                ug.GroupID as group_id, \
                u.UserName as str_user_name, \
                        ISNULL( u.[POLStatus],0) as int_pol_status, \
                        ISNULL( [POLRegion],0) as int_pol_region, \
                g.[Name] as str_group_name, \
                u.UserFullName as str_full_name, \
                '12345@abc' as str_pass_word, \
                        u.[UserPass] as str_pass, \
                (CASE \
                        WHEN u.ApproveLevel = 1 AND UserPosition = 4 THEN N'Nhân viên cửa hàng' \
                        WHEN u.ApproveLevel = 1 AND UserPosition = 3 THEN N'Quản lý CH' \
                        WHEN u.ApproveLevel = 2 THEN 'QLKV' END) \
                        as str_possition, \
                    (CASE \
                        WHEN ug.GroupID = 44  THEN N'1' else (select top(1) s.ShopID from pos.[GroupShop] gs  inner JOIN pos.[ShopDetail] s ON gs.ShopCode = s.Code where g.GroupID = gs.GroupID) \
                            end) as shop_id, \
                        (CASE \
                WHEN ug.GroupID = 44  THEN N'Hỗ trợ khách hàng' else  (select top(1) s.[Name] from pos.[GroupShop] gs  inner JOIN pos.[ShopDetail] s ON gs.ShopCode = s.Code where g.GroupID = gs.GroupID) \
                end) as str_shop_name, \
                        (case u.UserID when 617 then 1  when 1810  then 1 when 619 then 1 else 0 end) as bit_admin_caller \
                ,isnull(u.UserEmail,'') as str_user_email \
               ,(CASE\
                WHEN u.ApproveLevel = 2 THEN\
                (STUFF(\
                ',' + (\
                SELECT ',' + CONVERT(NVARCHAR(20), g.GroupID) \
                FROM pos.[User] _u_qlkv\
                INNER JOIN pos.[UserGroup] ug ON ug.UserID = _u_qlkv.UserID\
                INNER JOIN pos.GroupShop gs ON gs.GroupID = ug.GroupID\
                INNER JOIN pos.[Group] g ON gs.ShopCode = g.Code\
                WHERE _u_qlkv.UserID = u.UserID and g.Status = 1\
                FOR xml path('')\
                ) + ','\
                , 1\
                , 1\
                , ''))\
                ELSE '' END)\
                as group_qlkv\
                FROM [pos].[User]  u \
                left JOIN pos.[UserGroup] ug ON ug.UserID = u.UserID \
                left JOIN pos.[Group] g ON ug.GroupID = g.GroupID  AND g.STATUS = 1 \
            where u.Status =1  order by u.UserID asc",

        POL_ASSET_TYPE: "SELECT * FROM mobile.pol_asset",
        POL_AREA: "select  * from mobile.pol_area",
        POL_CHANNEL: "select * from mobile.pol_channel",
        POL_PRIORITY: "SELECT * FROM [mobile].[pol_priority]",
        POL_PROCESS: "SELECT " + _sql_select_top + " * FROM mobile.pol_online_process order by int_pol_pawn_id desc",
        POL_NOTIFY: "SELECT * FROM mobile.pol_notify order by int_date,int_time desc",
        POL_NOTIFY_STATE: "SELECT * FROM mobile.pol_notify_state order by int_date,int_time desc",
        POL_REASON_FAIL: "SELECT  * FROM mobile.pol_reason_fail",
        POL_STEP: "select * from mobile.pol_step",
        POL_SUPPORT_SCHEDULE: "SELECT  * FROM mobile.pol_support_schedule",
        POL_SYS_EMAIL: "SELECT * FROM [mobile].[sys_email]",
        POL_SYS_SMS: "SELECT * FROM [mobile].[sys_sms]",
        POL_PAWN_DETAIL: "SELECT * FROM [mobile].[pol_pawn_detail]"
    };

    // RESET_FROM_DB

    return [
        ['', 'pol', 'log', 10000, null],
        //['','pos', 'user', 10001],
        //['','pos', 'shop', 10002],
        //['','pos', 'group', 10003],
        //['','pol', 'sys_sms', 10004],
        //['','pol', 'sys_email', 10005],
        //['','pol', 'support_schedule', 10006],
        //['','pol', 'step', 10007],
        //['','pol', 'reason_fail', 10008],
        //['','pol', 'process', 10009],
        //['','pol', 'priority', 10010],
        //['','pol', 'pawn_search', 10011],
        //['','pol', 'pawn_detail', 10012],
        //['','pol', 'notify', 10014],
        //['','pol', 'customer', 10015],
        //['','pol', 'channel', 10016],
        //['','pol', 'asset_type', 10017],
        //['','pol', 'area', 10018],
        ['RESET_FROM_DB', 'pol', 'pawn', 10013, sql.POL_PAWN]
    ];
};

const CFS = cacheSetupDB_Scripts();
const install = (callback) => {
    if (CFS.length > 0) {
        const a = CFS.shift();
        if (a.length == 5) {
            const cf = { name: a[2].toUpperCase(), port: a[3], cmd_install: a[0], sql_scope: a[1], sql_select: a[4], sql_connect: sql_connect };
            API[cf.name] = require('./api.js').start(cf, () => {
                console.log('\n-> %s = READY ...\n\n', cf.name.toUpperCase());
                install(callback);
            });
        }
    } else {
        callback();
    }
};

install(() => {

    if (API['PAWN'].indexs) API['PAWN'].indexs(() => {
        console.log('\n\n INDEX DONE ...');
    });

});


const READ_LINE = require("readline");
const RL = READ_LINE.createInterface({ input: process.stdin, output: process.stdout });
RL.on("line", function (text) {
    const a = text.split(' ');
    let cmd = a[0].toLowerCase();
    switch (cmd) {
        case 'exit':
            process.exit();
            break;
        case 'cls':
            console.clear();
            break;
        //case 'delete_all':
        //    console.clear();
        //    //api.delete_all(function (res) {
        //    //    console.log(res);
        //    //});
        //    break;
        //case 'load':
        //    console.clear();
        //    //if (a.length > 1) {
        //    //    if (fs.existsSync(a[1])) {
        //    //        fs.readFile(a[1], (err, buf_file) => {
        //    //            if (err) {
        //    //                console.log('ERROR: ' + a[1], err);
        //    //                return;
        //    //            }
        //    //            console.log('BUF ' + a[1] + ' = ', buf_file.length);
        //    //            const o = JSON.parse(buf_file.toString('utf8'));
        //    //            if (o.POL_PROCESS) {
        //    //                console.log('JSON = ', o.POL_PROCESS.length);
        //    //                //console.log('JSON = ', o.POL_PROCESS);

        //    //                const _start = stopWatch();
        //    //                api.update(o.POL_PROCESS, function (res) {
        //    //                    console.log('??? = ', res);
        //    //                });

        //    //                const _end = stopWatch();
        //    //                console.log('time = ' + (_end - _start).toFixed(3) + ' s');
        //    //            }
        //    //        });
        //    //    } else {
        //    //        console.log('Cannot find ' + a[1]);
        //    //    }
        //    //}
        //    break;
        default:
            //console.clear();
            //api.add({ time: new Date().getTime() }, function (res) {
            //    console.log(res);
            //});
            if (a.length > 1) {
                let api = cmd;
                cmd = a[1].toLowerCase();
                let data = a.length > 2 ? a[2] : '';
                switch (api) {
                    case 'notify':
                        switch (cmd) {
                            case 'info':
                                console.log(noti.info());
                                break;
                            case 'add':
                                if (data.length > 0) {
                                    noti.add(data, (m_) => {
                                        console.log('-> ', api, cmd, m_);
                                    });
                                }
                                break;
                            case 'delete':
                                if (data.length > 0) {
                                    noti.delete(data, (m_) => {
                                        console.log('-> ', api, cmd, m_);
                                    });
                                }
                                break;
                        }
                        break;
                }
            }
            break;
    }
});