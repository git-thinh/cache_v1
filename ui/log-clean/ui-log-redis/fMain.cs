using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Text;
using System.Windows.Forms;

namespace ui_log_redis
{
    public partial class fMain : Form
    {
        public fMain()
        {
            InitializeComponent();
        }

        public const int WM_NCLBUTTONDOWN = 0xA1;
        public const int HT_CAPTION = 0x2;

        [DllImportAttribute("user32.dll")]
        public static extern int SendMessage(IntPtr hWnd, int Msg, int wParam, int lParam);
        [DllImportAttribute("user32.dll")]
        public static extern bool ReleaseCapture();
        private void Form_MouseDown(object sender, System.Windows.Forms.MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                ReleaseCapture();
                SendMessage(Handle, WM_NCLBUTTONDOWN, HT_CAPTION, 0);
            }
        }

        private void btnCleanLog_Click(object sender, EventArgs e)
        {
            try
            {
                var r = new Redis(txtIP.Text.Trim(), Convert.ToInt16(txtPort.Text.Trim()));
                r.FlushDb();
                r.Dispose();
                MessageBox.Show("Delete LOG success");
            }
            catch (Exception err) {
                MessageBox.Show("Delete LOG fail");
            }
        }

        private void fMain_Load(object sender, EventArgs e)
        {
            this.MouseDown += Form_MouseDown;
        }
    }
}
