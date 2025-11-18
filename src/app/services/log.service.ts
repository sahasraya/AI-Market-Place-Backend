import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LogStateService {
  private state: { [key: string]: any } = {};

  // Save state in memory
  saveState(log: string, data: any): void {
    this.state[log] = data;
  }

  // Get state from memory
  getState(log: string): any | null {
    return this.state[log] || null;
  }

  // Clear state for a specific log
  clearState(log: string): void {
    delete this.state[log];
  }
}
