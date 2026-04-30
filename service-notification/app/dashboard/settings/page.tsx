import { User, Bell, Key, Globe, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">จัดการการตั้งค่าบัญชีและการแจ้งเตือน</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">โปรไฟล์</CardTitle>
          </div>
          <CardDescription>ข้อมูลบัญชีของคุณ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">ชื่อ</label>
              <input
                type="text"
                placeholder="ชื่อของคุณ"
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                defaultValue="Demo User"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">อีเมล</label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                defaultValue="demo@example.com"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm">บันทึกโปรไฟล์</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">การแจ้งเตือน</CardTitle>
          </div>
          <CardDescription>เลือกช่องทางที่ต้องการรับการแจ้งเตือน</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {[
              { label: "แจ้งเตือนทุนใหม่ทาง Email", defaultChecked: true },
              { label: "แจ้งเตือนทุนใกล้หมดเขตทาง Email", defaultChecked: true },
              { label: "สรุปรายสัปดาห์", defaultChecked: false },
              { label: "ข่าวสารและอัปเดต", defaultChecked: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3">
                <span className="text-sm text-foreground">{item.label}</span>
                <input
                  type="checkbox"
                  defaultChecked={item.defaultChecked}
                  className="w-4 h-4 accent-primary"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button size="sm">บันทึกการตั้งค่า</Button>
          </div>
        </CardContent>
      </Card>

      {/* API & Integrations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">API & Integrations</CardTitle>
          </div>
          <CardDescription>จัดการ API Key และการเชื่อมต่อกับบริการอื่น</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">API Keys</p>
                <p className="text-xs text-muted-foreground">จัดการ key สำหรับเรียกใช้ API</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="http://localhost:3001/dashboard/keys" target="_blank" rel="noopener noreferrer">
                จัดการ Keys
              </a>
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Webhooks</p>
                <p className="text-xs text-muted-foreground">รับ event แบบ real-time</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/dashboard/webhooks">
                ตั้งค่า Webhooks
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-destructive" />
            <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>การดำเนินการเหล่านี้ไม่สามารถย้อนกลับได้</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 border border-destructive/20 rounded-lg">
            <div>
              <p className="text-sm font-medium text-foreground">ลบบัญชี</p>
              <p className="text-xs text-muted-foreground">ลบบัญชีและข้อมูลทั้งหมดอย่างถาวร</p>
            </div>
            <Button variant="destructive" size="sm" disabled>
              ลบบัญชี
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Badge variant="outline" className="text-[10px]">Pro</Badge>
            ฟีเจอร์นี้จะพร้อมใช้งานเมื่ออัปเกรดเป็น Pro
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
