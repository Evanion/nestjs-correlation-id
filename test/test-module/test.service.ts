import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class TestService {
  constructor(private httpService: HttpService) {}

  getTest() {
    return lastValueFrom(
      this.httpService
        .get('http://example.com/test')
        .pipe(map((res) => res.data)),
    );
  }
}
