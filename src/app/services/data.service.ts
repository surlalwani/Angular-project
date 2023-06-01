import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BarData } from '../app.component';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  getChartData(): Observable<BarData[]> {
    // Simulate fetching data from a mock API endpoint
    const mockData: BarData[] = [
      { label: 'Framework 1', value: 100 },
      { label: 'Framework 2', value: 200 },
      { label: 'Framework 3', value: 150 },
      // Add more data objects as needed
    ];

    return of(mockData);
  }
}
