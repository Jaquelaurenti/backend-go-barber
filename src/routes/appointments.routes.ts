import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppointmentRepository from '../repositories/AppointmentsRepository';
import AppointmentService from '../services/CreateAppointmentService';
import ensureAuthAuthenticated from '../middlewares/ensureAuthenticated';


const appointmentsRouters = Router();

appointmentsRouters.use(ensureAuthAuthenticated);

appointmentsRouters.get('/', async (req, res) => {

  const appointmentsRepository = getCustomRepository(AppointmentRepository);
  const appointment = await appointmentsRepository.find();
  return res.json(appointment);

});

appointmentsRouters.post('/', async (req, res) => {
  const { provider_id, date } = req.body;
  const parsedDate = parseISO(date);

  const appointmentService = new AppointmentService();

  const appointment = await appointmentService.execute({
    provider_id,
    date: parsedDate,
  });
  return res.json(appointment);
});

export default appointmentsRouters;
