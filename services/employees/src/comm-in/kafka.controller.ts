import { Controller, UseFilters } from '@nestjs/common';
import { KafkaExceptionFilter } from './kafka.exception.filter';

@Controller()
@UseFilters(KafkaExceptionFilter)
export class KafkaController {}
