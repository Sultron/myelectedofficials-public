import { z } from 'zod';

const ZipCodeSchema = z.string().regex(/^\d{5}$/);

export { ZipCodeSchema };
