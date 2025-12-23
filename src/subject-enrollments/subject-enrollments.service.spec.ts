import { Test, TestingModule } from '@nestjs/testing';
import { SubjectEnrollmentsService } from './subject-enrollments.service';

describe('SubjectEnrollmentsService', () => {
  let service: SubjectEnrollmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubjectEnrollmentsService],
    }).compile();

    service = module.get<SubjectEnrollmentsService>(SubjectEnrollmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
