import { Test, TestingModule } from '@nestjs/testing';
import { SubjectEnrollmentsController } from './subject-enrollments.controller';
import { SubjectEnrollmentsService } from './subject-enrollments.service';

describe('SubjectEnrollmentsController', () => {
  let controller: SubjectEnrollmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectEnrollmentsController],
      providers: [SubjectEnrollmentsService],
    }).compile();

    controller = module.get<SubjectEnrollmentsController>(SubjectEnrollmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
