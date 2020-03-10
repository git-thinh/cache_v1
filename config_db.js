let config_db = function config_db() {

    const _sql_select_top = ''; //top 3
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
    this.get_config = function () {
        const sql = {
            PAWN: "SELECT " + _sql_select_top + " *,isnull( (select * from [SplitStringToTable](str_url,'&')),'') as str_campaign FROM mobile.pol_pawn order by id asc",
            CUSTOMER: "SELECT " + _sql_select_top + " * FROM mobile.pol_customer order by id desc",
            GROUP: "SELECT \
                    GroupID as id \
                    ,ParentID as parent_id \
                    ,Code as str_code \
                    ,[Name] as str_name \
                    ,[Status] as int_status \
            FROM [pos].[Group] where IsShop=1 or GroupID=44 or GroupID=58",
            SYS_CONFIG: "SELECT \
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

            ASSET_TYPE: "SELECT * FROM mobile.pol_asset",
            AREA: "select  * from mobile.pol_area",
            CHANNEL: "select * from mobile.pol_channel",
            PRIORITY: "SELECT * FROM [mobile].[pol_priority]",
            PROCESS: "SELECT " + _sql_select_top + " * FROM mobile.pol_online_process order by int_pol_pawn_id desc",
            NOTIFY: "SELECT * FROM mobile.pol_notify order by int_date,int_time desc",
            //NOTIFY_STATE: "SELECT * FROM mobile.pol_notify_state order by int_date,int_time desc",
            REASON_FAIL: "SELECT  * FROM mobile.pol_reason_fail",
            STEP: "select * from mobile.pol_step",
            SUPPORT_SCHEDULE: "SELECT  * FROM mobile.pol_support_schedule",
            SYS_EMAIL: "SELECT * FROM [mobile].[sys_email]",
            SYS_SMS: "SELECT * FROM [mobile].[sys_sms]",
            PAWN_DETAIL: "SELECT * FROM [mobile].[pol_pawn_detail]"
        };

        const schema = {
            PAWN: {
                id: 'KEY_IDENTITY',

                int_queued: 'API',
                int_status: 0,

                step_id: -1,
                asset_type_id: -1,
                channel_id: -1,
                area_id: -1,
                city_id: -1,
                district_id: -1,
                int_days: -1,
                lng_money: -1,
                customer_id: -1,
                str_asset_type_name: '',
                str_channel_name: '',
                str_city_name: '',
                str_description: '',
                str_district_name: '',
                str_product_year: '',
                str_trademark: '',
                str_url: '',
                user_created_id: -1,
                cus_created_id: -1,
                shop_id: -1,
                caller_shop_id: -1,
                caller_online_id: -1,
                group_id: -1,
                int_group_status: -1,
                bit_car_in_bank: 0,
                int_priority_id: -1,
                int_sms: -1,
                str_group_ids_reveiced: '',
                int_trans_to_shop_date: -1,
                int_trans_to_shop_time: -1,
                int_reference_type: -1,
                str_reference_affilate_id: '',
                user_cancel_id: -1,
                int_pawn_id_pos: -1,
                int_customer_id_pos: -1,
                int_loan_money_pos: -1,
                int_loan_days_pos: -1,
                int_create_date_pos: -1,
                int_from_date_pos: -1,
                str_codeno_pos: '',
                str_category_code_pos: '',
                int_status_pos: -1,
                int_loan_money_org_pos: -1,
                int_is_f88_cus_pos: -1,
                str_pos_asset_code_pos: -1,
                int_order_priority: -1,
                is2step: 0,
                str_campaign: '',

                int_created_date: 'yyyyMMdd',
                int_created_time: 'hhmmss',
                int_cancel_date: '-1|yyyyMMdd',
                int_cancel_time: '-1|hhmmss',
                int_set_caller_online_date: '-1|yyyyMMdd',
                int_set_caller_online_time: '-1|hhmmss',

                //"ix___": 459002,
                //"#ids": "  479837   1160 58 20   58  468435 479837 ",
                //"#ascii": " 1 20200217 0948003456 tests qlch quan ly ch f88 tests qlkv0 qlkv0 quan ly cua hang test 1 1 dien thoai 20200217 ",
                //"#utf8": "  1 1 quản lý cửa hàng tests f88 tests qlkv0 qlkv0 quản lý cửa hàng test ô tô điện thoại an giang 1 an phú  ",
                //"#org": "1 1 Ô tô",
                //"___customer": { },
                //"___caller_shop": { },
                //"___caller_online": { },
                //"___group": { },
                //"___list_support_schedule": [ ],
                //"___list_online_process": [ ]
            },
            CUSTOMER: {
                id: 'KEY_IDENTITY',
                int_status: -1,
                int_gender: -1,
                str_name: '',
                int_created_date: 'yyyyMMdd',
                int_created_time: 'hhmmss',
                int_birthday_date: 0,
                str_address: '',
                str_email: '',
                str_phone: '',

                //"ix___": 10630,
                //"#ids": " 479837 ",
                //"#ascii": " 1 20200217 0948003456 ",
                //"#utf8": " 1 1 ",
                //"#org": "1 1"
            },
            GROUP: {
                id: 'KEY_IDENTITY',
                parent_id: -1,
                str_code: '',
                str_name: '',
                int_status: -1,

                //"ix___": 0,
                //"#ids": " 1 ",
                //"#ascii": " bg nhom ch bac giang ",
                //"#utf8": " bg nhóm ch bắc giang ",
                //"index___": 1
            },
            SYS_CONFIG: {
                id: 'KEY_IDENTITY',
                str_code: '',
                str_type: '',
                str_value: '',
                str_name: '',
                int_status: -1,

                //"ix___": 0,
                //"#ids": " 1 ",
                //"#ascii": " bg nhom ch bac giang ",
                //"#utf8": " bg nhóm ch bắc giang ",
                //"index___": 1
            },
            SHOP: {
                id: 'KEY_IDENTITY',
                code: '',
                str_name: '',

                //"ix___": 0,
                //"#ids": " 1 ",
                //"#ascii": " f88 dang dung cu ",
                //"#utf8": " f88 đặng dung cũ "
            },
            REGION: {
                id: 'KEY_IDENTITY',
                str_name: '',
                int_pid: 0,
                str_parent_name: '',

                //"ix___": 0,
                //"#ids": " 1 ",
                //"#ascii": " an giang ",
                //"#utf8": " an giang ",
                //"index___": 1
            },
            USER: {
                id: 'KEY_IDENTITY',
                str_call_out_tooken: '',
                int_approve_level: -1,
                str_user_position: '',
                group_id: -1,
                str_user_name: '',
                int_pol_status: -1,
                int_pol_region: -1,
                str_group_name: '',
                str_full_name: '',
                str_pass_word: '12345@abc',
                str_pass: '',
                str_possition: '',
                shop_id: -1,
                str_shop_name: '',
                bit_admin_caller: 0,
                str_user_email: '',
                group_qlkv: '',

                //"ix___": 0,
                //"#ids": " 1   ",
                //"#ascii": " hndd ",
                //"#utf8": " f88 đặng dung  ",
                //"user_id": 1,
                //"ref_id": 1,
                //"scope_ids": "pol"
            },
            ASSET_TYPE: {
                id: 'KEY_IDENTITY',
                int_status: -1,
                str_name: '',

                //"ix___": 0,
                //"#ids": " 1 ",
                //"#ascii": " o to ",
                //"#utf8": " ô tô ",
                //"index___": 1
            },
            AREA: {
                id: 'KEY_IDENTITY',
                int_status: -1,
                str_name: '',

                //"ix___": 1,
                //"index___": 2
            },
            CHANNEL: {
                id: 'KEY_IDENTITY',
                str_name: '',
                int_status: -1,

                //"ix___": 0,
                //"#ids": " 54 ",
                //"#ascii": " landing f88 vn ",
                //"#utf8": " landing f88 vn ",
                //"index___": 1
            },
            PRIORITY: {
                id: 'KEY_IDENTITY',
                int_status: -1,
                str_priority_name: '',

                //"ix___": 0,
                //"#ascii": " cao ",
                //"#utf8": " cao ",
                //"index___": 1
            },
            PROCESS: {
                id: 'KEY_IDENTITY',
                int_pol_pawn_id: -1,
                str_content: '',
                int_action: -1,
                str_action_name: '',
                int_pawn_status: -1,
                int_recept_group_id: -1,
                lng_created_at: 'yyyyMMddhhmmss',
                int_created_by: -1,
                int_created_group_id: -1,
                str_created_group: '',
                int_status: -1,
                str_canceled_reason: '',
                str_created_by_name: '',

                //"ix___": 1146071
            },
            NOTIFY: {
                id: 'KEY_IDENTITY',
                int_type: -1,
                str_actions: '',
                step_id: -1,
                ref_ids: '',
                user_ids: '',
                group_ids: '',
                message: '',
                int_date: 'yyyyMMdd',
                int_time: 'hhmmss',
                int_status: -1,
                //"ix___": 7516
            },
            //NOTIFY_STATE: {},
            REASON_FAIL: {
                id: 'KEY_IDENTITY',
                int_status: -1,
                str_canceled_reason: '',

                //"ix___": 0,
                //"#ascii": " ho tro thong tin ",
                //"#utf8": " hỗ trợ thông tin ",
                //"index___": 1
            },
            STEP: {
                id: 'KEY_IDENTITY',
                int_status: -1,
                str_name: '',

                //"ix___": 4
            },
            SUPPORT_SCHEDULE: {
                id: 'KEY_IDENTITY',
                int_state: -1,
                int_pawn_online_id: -1,
                int_support_time: 'yyyyMMddhhmmss',
                int_created_by: -1,
                int_created_at: 'yyyyMMddhhmmss',
                str_note: '',
                str_created_by_name: '',

                //"ix___": 0
            },
            SYS_EMAIL: {
                id: 'KEY_IDENTITY',
                step_id: -1,
                ref_ids: '',
                user_ids: '',
                group_ids: '',
                str_emails: '',
                str_message: '',
                int_date: 'yyyyMMdd',
                int_time: 'hhmmss',
                int_send_date: 'yyyyMMdd',
                int_send_time: 'hhmmss',
                int_read_date: -1,
                int_read_time: -1,
                int_status: -1,

                //"ix___": 0
            },
            SYS_SMS: {
                id: 'KEY_IDENTITY',
                step_id: -1,
                ref_ids: '',
                user_ids: '',
                group_ids: '',
                str_phones: '',
                str_message: '',
                int_date: 'yyyyMMdd',
                int_time: 'hhmmss',
                int_send_date: 'yyyyMMdd',
                int_send_time: 'hhmmss',
                int_read_date: -1,
                int_read_time: -1,
                int_status: -1,

                //"ix___": 0
            },
            PAWN_DETAIL: {
                id: 'KEY_IDENTITY',
                pol_pawn_id: -1,
                int_recall_time: -1,
                int_no_contacted_at: -1,
                int_created_date: 'yyyyMMdd',
                int_created_time: 'hhmmss',

                lng_register_datetime: '-1|yyyyMMddhhmmss',
                lng_last_trans_datetime: '-1|yyyyMMddhhmmss',

                //dtm_register_date: null,
                //dtm_last_trans: null,
                int_urgent_level: -1,
                int_order_priority: -1,

                //"ix___": 468434
            }
        };

        const valid_add = {
            CUSTOMER: {
                str_name: { name: 'valid___not_empty', para: null },
                str_phone: { name: 'valid___is_phone', para: null }
            },
            PAWN: {
                int_days: { name: 'valid___greater_than', para: 30 },
                lng_money: { name: 'valid___greater_than', para: 500000 },
                asset_type_id: { name: 'valid___greater_than', para: 0 },
                city_id: { name: 'valid___greater_than', para: 0 },
                district_id: { name: 'valid___greater_than', para: 0 }
            }
        };

        const action = ''; // RESET_FROM_DB | FIRST_FROM_DB | DELETE_ALL

        return [
            {
                id: 10,
                name: 'LOG',
                port: 10000,
                schema: null,
                cmd_install: '',
                sql_scope: null,
                sql_select: null,
                sql_connect: null,
                valid_add: null
            },
            {
                id: 11,
                scope: 'pos',
                name: 'USER',
                port: 10001,
                schema: schema.USER,
                valid_add: null,
                cmd_install: action,
                sql_select: sql.USER,
                sql_connect: sql_connect.pos
            },
            {
                id: 12,
                scope: 'pos',
                name: 'SHOP',
                port: 10002,
                schema: schema.SHOP,
                valid_add: null,
                cmd_install: action,
                sql_select: sql.SHOP,
                sql_connect: sql_connect.pos
            },
            {
                id: 13,
                scope: 'pos',
                name: 'GROUP',
                port: 10003,
                schema: schema.GROUP,
                valid_add: null,
                cmd_install: action,
                sql_select: sql.GROUP,
                sql_connect: sql_connect.pos
            },
            {
                id: 14,
                scope: 'pol',
                name: 'SYS_SMS',
                port: 10004,
                schema: schema.SYS_SMS,
                valid_add: null,
                cmd_install: action,
                sql_select: sql.SYS_SMS,
                sql_connect: sql_connect.pol
            },
            {
                id: 15,
                scope: 'pol',
                name: 'SYS_EMAIL',
                port: 10005,
                schema: schema.SYS_EMAIL,
                valid_add: null,
                cmd_install: action,
                sql_select: sql.SYS_EMAIL,
                sql_connect: sql_connect.pol
            },
            {
                id: 16,
                scope: 'pol',
                name: 'SUPPORT_SCHEDULE',
                port: 10006,
                schema: schema.SUPPORT_SCHEDULE,
                valid_add: null,
                cmd_install: action,
                sql_select: sql.SUPPORT_SCHEDULE,
                sql_connect: sql_connect.pol
            },
            {
                id: 17,
                scope: 'pol',
                name: 'STEP',
                port: 10007,
                schema: schema.STEP,
                valid_add: null,
                cmd_install: action,
                sql_select: sql.STEP,
                sql_connect: sql_connect.pol
            },
            {
                id: 18,
                scope: 'pol',
                name: 'REASON_FAIL',
                port: 10008,
                schema: schema.REASON_FAIL,
                valid_add: null,
                cmd_install: action,
                sql_select: sql.REASON_FAIL,
                sql_connect: sql_connect.pol
            },
            {
                id: 19,
                scope: 'pol',
                name: 'PROCESS',
                port: 10009,
                schema: schema.PROCESS,
                valid_add: null,
                cmd_install: action,
                sql_select: sql.PROCESS,
                sql_connect: sql_connect.pol
            },
            {
                id: 20,
                scope: 'pol',
                name: 'PRIORITY',
                port: 10010,
                schema: schema.PRIORITY,
                valid_add: null,
                cmd_install: action,
                sql_select: sql.PRIORITY,
                sql_connect: sql_connect.pol
            },
            {
                id: 21,
                scope: 'pol',
                name: 'PAWN_DETAIL',
                port: 10012,
                schema: schema.PAWN_DETAIL,
                valid_add: null,
                cmd_install: action,
                sql_select: sql.PAWN_DETAIL,
                sql_connect: sql_connect.pol
            },
            {
                id: 22,
                scope: 'pol',
                name: 'NOTIFY',
                port: 10014,
                schema: schema.NOTIFY,
                valid_add: null,
                cmd_install: action,
                sql_select: sql.NOTIFY,
                sql_connect: sql_connect.pol
            },
            {
                id: 23,
                scope: 'pol',
                name: 'CUSTOMER',
                port: 10015,
                schema: schema.CUSTOMER,
                valid_add: valid_add.CUSTOMER,
                cmd_install: action,
                sql_select: sql.CUSTOMER,
                sql_connect: sql_connect.pol
            },
            {
                id: 24,
                scope: 'pol',
                name: 'CHANNEL',
                port: 10016,
                schema: schema.CHANNEL,
                valid_add: null,
                cmd_install: action,
                sql_select: sql.CHANNEL,
                sql_connect: sql_connect.pol
            },
            {
                id: 25,
                scope: 'pol',
                name: 'ASSET_TYPE',
                port: 10017,
                schema: schema.ASSET_TYPE,
                valid_add: null,
                cmd_install: action,
                sql_select: sql.ASSET_TYPE,
                sql_connect: sql_connect.pol
            },
            {
                id: 26,
                scope: 'pol',
                name: 'AREA',
                port: 10018,
                schema: schema.AREA,
                valid_add: null,
                cmd_install: action,
                sql_select: sql.AREA,
                sql_connect: sql_connect.pol
            },
            {
                id: 27,
                scope: 'pol',
                name: 'PAWN',
                port: 10013,
                schema: schema.PAWN,
                valid_add: valid_add.PAWN,
                cmd_install: action,
                sql_select: sql.PAWN,
                sql_connect: sql_connect.pol
            }
        ];
    };
};

config_db.instance = null;
config_db.getInstance = function () {
    if (this.instance === null) this.instance = new config_db();
    return this.instance;
};
module.exports = config_db.getInstance();