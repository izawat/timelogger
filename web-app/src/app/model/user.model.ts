/** ユーザ詳細 */
export class UserDetail {
  id: string;
  name: string;
  timeLoggers: TimeLoggerBasicInfo[];
  lastLogin: Date | null;
  createdAt: Date | null;

  constructor() {
    this.id = '';
    this.name = '';
    this.timeLoggers = [];
    this.lastLogin = null;
    this.createdAt = null;
  }
}

/** タイムロガーの基本情報 */
export class TimeLoggerBasicInfo {
  id: string;
  name: string;

  constructor() {
    this.id = '';
    this.name = '';
  }
}
