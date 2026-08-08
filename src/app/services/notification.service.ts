import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private toastMixin = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  constructor() { }

  showToast(message: string, icon: SweetAlertIcon = 'success'): void {
    this.toastMixin.fire({
      icon: icon,
      title: message
    });
  }

  toastSuccess(msg: string) { this.showToast(msg, 'success'); }
  toastError(msg: string) { this.showToast(msg, 'error'); }
  toastWarning(msg: string) { this.showToast(msg, 'warning'); }
  toastInfo(msg: string) { this.showToast(msg, 'info'); }

  async confirm(title: string, text: string, confirmButtonText: string = 'Confirmer'): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      reverseButtons: true
    });

    return result.isConfirmed;
  }
}
