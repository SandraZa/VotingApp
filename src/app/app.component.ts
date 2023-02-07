import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { VotersDialogComponent } from './dialogs/voters-dialog/voters-dialog.component';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { CandidatesDialogComponent } from './dialogs/candidates-dialog/candidates-dialog.component';
import { Candates, Voters } from './shared/voting-service.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('votersTable', { read: MatSort, static: true })
  sortVoters!: MatSort;
  @ViewChild('candidatesTable', { read: MatSort, static: true })
  sortCandidates!: MatSort;

  public candidates: MatTableDataSource<Candates>;
  public candidatesList: Candates[] = [];
  public candidateSelected: string = '';
  public columnsForVoters: string[] = ['name', 'hasVoted'];
  public columnsForCandates: string[] = ['name', 'votes'];
  public myForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
  });
  public name: string = '';
  public voters: MatTableDataSource<Voters>;
  public voterSelected: string = '';
  public votersList: Voters[] = [];
  public votersCanVoteList: Voters[] = [];
  private readonly dataAddress: string =
    'https://data-b3afa-default-rtdb.europe-west1.firebasedatabase.app/';

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.candidates = new MatTableDataSource(this.candidatesList);
    this.voters = new MatTableDataSource(this.votersList);
  }

  public addVoterDialog(): void {
    let voterNames: string[] = [];
    this.votersList.forEach((elem) => voterNames.push(elem.name));
    const dialogRef = this.dialog.open(VotersDialogComponent, {
      data: { list: voterNames, name: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.name = result;
        this.addVoter({ name: result, hasVoted: false });
        this.getVoters();
      }
    });
  }

  public addCandidateDialog(): void {
    let candidateNames: string[] = [];
    this.candidatesList.forEach((elem) => candidateNames.push(elem.name));
    const dialogRef = this.dialog.open(CandidatesDialogComponent, {
      data: { list: candidateNames, name: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.name = result;
        this.addCandidate({ name: result, votes: 0 });
        this.getCandidates();
      }
    });
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      name: new FormControl(null),
    });
    this.getVoters();
    this.getCandidates();
    this.voters.sort = this.sortVoters;
    this.candidates.sort = this.sortCandidates;
  }

  public reset(data: string): void {
    this.http.delete(this.dataAddress + data + '.json').subscribe(() => {
      if (data === 'voters') {
        this.votersList = [];
        this.setVoters();
      } else {
        this.candidatesList = [];
        this.setCandidates();
      }
    });
  }

  public vote(contactForm: NgForm): void {
    this.addVoteForCandidate(contactForm.value.candidateSelected);
    this.changeVoterToVoted(contactForm.value.voterSelected);
    this.checkVoters(this.votersList);
    contactForm.resetForm();
  }

  private addVoter(postData: { name: string; hasVoted: boolean }) {
    this.http
      .post(this.dataAddress + 'voters.json', postData)
      .subscribe({ complete: () => this.getVoters() });
  }

  private addCandidate(postData: { name: string; votes: number }) {
    this.http.post(this.dataAddress + 'candidates.json', postData).subscribe({
      complete: () => this.getCandidates(),
    });
  }

  private checkVoters(votersList: Voters[]) {
    this.votersCanVoteList = votersList.filter(
      (elem) => elem.hasVoted === false
    );
  }

  private getVoters(): void {
    this.http.get(this.dataAddress + 'voters.json').subscribe((res) => {
      this.votersList = [];
      if (res) {
        [...Object.entries(res)].forEach((res) =>
          this.votersList.push({
            key: res[0],
            name: res[1].name,
            hasVoted: res[1].hasVoted,
          })
        );
      }
      this.setVoters();
    });
  }

  private setVoters(): void {
    this.voters = new MatTableDataSource(this.votersList);
    this.checkVoters(this.votersList);
    this.voters.sort = this.sortVoters;
  }

  private setCandidates(): void {
    this.candidates = new MatTableDataSource(this.candidatesList);
    this.candidates.sort = this.sortCandidates;
  }

  private getCandidates(): void {
    this.http.get(this.dataAddress + 'candidates.json').subscribe((res) => {
      this.candidatesList = [];
      if (res) {
        [...Object.entries(res)].forEach((res) =>
          this.candidatesList.push({
            key: res[0],
            name: res[1].name,
            votes: res[1].votes,
          })
        );
      }
      this.setCandidates();
    });
  }

  private addVoteForCandidate(candidate: string): void {
    const candidateKey = this.candidatesList.find(
      (elem) => elem.name === candidate
    );
    if (candidateKey) {
      candidateKey.votes++;
      const putData = { name: candidateKey.name, votes: candidateKey.votes };
      this.http
        .put(
          this.dataAddress + 'candidates/' + candidateKey.key + '.json',
          putData
        )
        .subscribe({ error: (err) => console.log(err) });
    }
  }

  private changeVoterToVoted(voter: string): void {
    const voterKey = this.votersList.find((elem) => elem.name === voter);
    if (voterKey) {
      voterKey.hasVoted = true;
      const putData = { name: voterKey.name, hasVoted: voterKey.hasVoted };
      this.http
        .put(this.dataAddress + 'voters/' + voterKey.key + '.json', putData)
        .subscribe({ error: (err) => console.log(err) });
    }
  }
}
