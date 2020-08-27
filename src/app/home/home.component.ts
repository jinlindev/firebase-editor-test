import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import MediumEditor from 'medium-editor';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  editor: MediumEditor;
  user;

  constructor(
    public authService: AuthService,
    private db: AngularFirestore
  ) {
    this.authService.user.subscribe(res => {
      this.user = res;
      if (res) {
        this.db.collection('users').doc(res.uid).valueChanges().subscribe((user: any) => {
          if (!user) {
            this.db.collection('users').doc(res.uid).set({
              email: res.email,
              displayName: res.displayName
            })
          }
        });
        this.db.collection('users').doc(res.uid).get().subscribe(user => {
          if (user && user.data() && user.data().content && this.editor) {
            this.editor.setContent(user.data().content);
          }
        });
      }
    })
  }

  ngOnInit(): void {
    this.editor = new MediumEditor('.medium-editor', {
      toolbar: {
        /* These are the default options for the toolbar,
            if nothing is passed this is what is used */
        allowMultiParagraphSelection: true,
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
        diffLeft: 0,
        diffTop: -10,
        firstButtonClass: 'medium-editor-button-first',
        lastButtonClass: 'medium-editor-button-last',
        relativeContainer: null,
        standardizeSelectionStart: false,
        static: false,
        /* options which only apply when static is true */
        align: 'center',
        sticky: false,
        updateOnEmptySelection: false
      }
    });

    this.editor.subscribe('editableInput', (event, editable: Element) => {
      if (this.user) {
        this.db.collection('users').doc(this.user.uid).update({
          content: event.target.innerHTML
        });
      }
    });
  }

}
