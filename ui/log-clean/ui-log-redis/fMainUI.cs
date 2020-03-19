using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Windows.Forms;
using System.Xml;
using System.Linq;
using TeamDevRedis;
using TeamDevRedis.LanguageItems;

namespace ui_log_redis
{
    public partial class fMainUI : Form
    {
        #region [ UI ]

        static fMainUI()
        {
            AppDomain.CurrentDomain.AssemblyResolve += (se, ev) =>
            {
                Assembly asm = null;
                string comName = ev.Name.Split(',')[0];
                string resourceName = @"DLL\" + comName + ".dll";
                var assembly = Assembly.GetExecutingAssembly();
                resourceName = typeof(fMainUI).Namespace + "." + resourceName.Replace(" ", "_").Replace("\\", ".").Replace("/", ".");
                using (Stream stream = assembly.GetManifestResourceStream(resourceName))
                {
                    if (stream != null)
                    {
                        byte[] buffer = new byte[stream.Length];
                        using (MemoryStream ms = new MemoryStream())
                        {
                            int read;
                            while ((read = stream.Read(buffer, 0, buffer.Length)) > 0)
                                ms.Write(buffer, 0, read);
                            buffer = ms.ToArray();
                        }
                        asm = Assembly.Load(buffer);
                    }
                }
                return asm;
            };
        }

        const int BAR_HEIGHT = 5;
        const int MAIN_HEIGHT_NORMAL = 590;
        const int MAIN_WIDTH_NORMAL = 1024;

        public const int WM_NCLBUTTONDOWN = 0xA1;
        public const int HT_CAPTION = 0x2;

        [DllImportAttribute("user32.dll")]
        public static extern int SendMessage(IntPtr hWnd, int Msg, int wParam, int lParam);
        [DllImportAttribute("user32.dll")]
        public static extern bool ReleaseCapture();
        private void BoxUI_MouseDown(object sender, System.Windows.Forms.MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                ReleaseCapture();
                SendMessage(Handle, WM_NCLBUTTONDOWN, HT_CAPTION, 0);
            }
        }

        public fMainUI()
        {
            InitializeComponent();
            this.panelHeader.MouseDown += BoxUI_MouseDown;
            this.lblMessage.MouseDown += BoxUI_MouseDown;
        }

        private void fMainUI_Load(object sender, EventArgs e)
        {
            f_ui_init();
        }

        private void btnMin_Click(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Minimized;
        }

        private void btnMax_Click(object sender, EventArgs e)
        {
            if (this.Height == MAIN_HEIGHT_NORMAL)
            {
                //this.WindowState = FormWindowState.Maximized;
                this.Top = 0;
                this.Left = 0;
                this.Height = Screen.PrimaryScreen.WorkingArea.Height - BAR_HEIGHT;
                this.Width = Screen.PrimaryScreen.WorkingArea.Width;
            }
            else
            {
                //this.WindowState = FormWindowState.Normal;
                this.Top = ((Screen.PrimaryScreen.WorkingArea.Height - BAR_HEIGHT) - MAIN_HEIGHT_NORMAL) / 2;
                this.Left = (Screen.PrimaryScreen.WorkingArea.Width - MAIN_WIDTH_NORMAL) / 2;
                this.Height = MAIN_HEIGHT_NORMAL;
                this.Width = MAIN_WIDTH_NORMAL;
            }
        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void btnClearAll_Click(object sender, EventArgs e)
        {
            f_clean_all();
        }

        private void btnLoad_Click(object sender, EventArgs e)
        {
            f_load();
        }

        private void btnWriteFile_Click(object sender, EventArgs e)
        {
            f_export_file();
        }

        private void btnSearch_Click(object sender, EventArgs e)
        {
            f_search();
        }

        private void btnLogItemSaveFile_Click(object sender, EventArgs e)
        {
            f_editor_save_file();
        }

        private void btnEditorSearch_Click(object sender, EventArgs e)
        {
            f_editor_search();
        }

        private void btnEditorFontBigger_Click(object sender, EventArgs e)
        {
            f_editor_font_bigger();
        }

        private void btnEditorFontSmaller_Click(object sender, EventArgs e)
        {
            f_editor_font_smaller();
        }

        #endregion

        #region [ Methods ]

        void f_ui_init()
        {
            this.Top = 0;
            this.Left = 0;
            this.Height = Screen.PrimaryScreen.WorkingArea.Height - BAR_HEIGHT;
            this.Width = Screen.PrimaryScreen.WorkingArea.Width;

            txtEditor.Font = new Font("Consolas", 14f, FontStyle.Regular);
        }

        void f_message(string text = "") => lblMessage.Text = text;

        void f_dialog_save_file()
        {

        }


        static RedisDataAccessProvider m_redis;
        //static string[] m_keys = new string[] { };
        static oKey[] m_keys = new oKey[] { };

        void f_load()
        {
            f_message();
            try
            {
                m_redis = new RedisDataAccessProvider();
                m_redis.Configuration = new Configuration() { Host = txtIP.Text.Trim(), Port = Convert.ToInt16(txtPort.Text.Trim()) };
                m_redis.Connect();


                string[] keys = m_redis.ReadMultiString(m_redis.SendCommand(RedisCommand.KEYS, "*"));
                m_keys = keys.Select(x => new oKey(m_redis, x)).ToArray();



                f_message("OK");
            }
            catch (Exception err)
            {
                f_message("FAIL: " + err.Message);
            }
        }

        void f_search()
        {

        }

        void f_clean_all()
        {

        }

        void f_export_file()
        {

        }

        void f_editor_save_file()
        {

        }

        void f_editor_search()
        {

        }

        void f_editor_font_bigger()
        {
            float fs = txtEditor.Font.Size + 1;
            txtEditor.Font = new Font("Consolas", fs, FontStyle.Regular);
        }

        void f_editor_font_smaller()
        {
            float fs = txtEditor.Font.Size - 1;
            txtEditor.Font = new Font("Consolas", fs, FontStyle.Regular);
        }

        #endregion

    }
}
