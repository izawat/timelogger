export class OperationLog {
  id: string;
  userId: string;
  loggerId: string;
  timerGroupId: string;
  timerId: string;
  operationType:
    | 'create'
    | 'start'
    | 'stop'
    | 'delete'
    | 'rename'
    | 'move'
    | 'other';
  operationDetail: string;
  timestamp: Date | null;

  constructor() {
    this.id = '';
    this.userId = '';
    this.loggerId = '';
    this.timerGroupId = '';
    this.timerId = '';
    this.operationType = 'other';
    this.operationDetail = '';
    this.timestamp = null;
  }
}
