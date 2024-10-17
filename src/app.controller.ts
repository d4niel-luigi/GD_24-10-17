import { Controller, Get, Post, Render, Body, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { BookingDto } from './booking.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }
  @Get('success')
  @Render('success')
  showSuccessPage() {
    return {
      message: 'Rendben',
    };
  }
  @Get('booking')
  @Render('bookingForm')
  showBookingForm() {
    return { errors : [], bookingData: {}};
  }
 @Post('booking')
@Render('bookingForm')
handleBookingForm(
  @Body() bookingData: BookingDto,
  @Res() response: Response,
) {
  const errors = [];
  
  if (!bookingData.name || !bookingData.name.trim()) {
    errors.push('A név megadását nem hagyhatja ki!');
  }

  const emailValidation = /.+@.+\..+/;
  if (!emailValidation.test(bookingData.email)) {
    errors.push('Az email cím formátuma nem helyes!');
  }

  const currentDate = new Date();
  if (!bookingData.date || new Date(bookingData.date) < currentDate) {
    errors.push('A dátum érvénytelen!');
  }

  const guests = parseInt(bookingData.guests, 10);
  if (isNaN(guests) || guests < 1 || guests > 10) {
    errors.push('Legalább 1 de maximum 10 vendéget tud csak foglalni!');
  }

  if (errors.length > 0) {
    response.render('bookingForm', { errors: errors, bookingData });
  } else {
    response.redirect('/success');
  }
}
}
