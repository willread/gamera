import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

import { Profile } from '../services/api.service';
import { ListGame, ListService } from '../services/list.service';
import { SECONDS_IN_HOUR, SECONDS_IN_MINUTE, HoursMinutesSeconds, UtilitiesService } from '../services/utilities.service';

const UPDATE_DEBOUNCE_TIME = 500;
const SECONDS_PLAYED_UPDATE_INTERVAL = 500;

@Component({
  selector: 'app-time-played',
  templateUrl: './time-played.component.html',
  styleUrls: ['./time-played.component.scss']
})
export class TimePlayedComponent implements OnInit, OnDestroy {
  @Input() listGame: ListGame;

  public hours = new FormControl();
  public minutes = new FormControl();
  public seconds = new FormControl();
  public playing: boolean = false;
  public secondsPlayed: number;
  public startTime: Date;

  private profile: Profile;
  private playTimeUpdateInterval: any;
  public secondsToLog: number;

  constructor(
    private utilities: UtilitiesService,
    private listService: ListService
  ) { }

  ngOnInit(): void {
    if (this.listGame.startedPlayingAt) {
      this.playing = true;
      this.startTime = new Date(this.listGame.startedPlayingAt);
      this.startUpdatingSecondsPlayed();
    }

    this.hours.setValue(0, { emitEvent: false });
    this.minutes.setValue(0, { emitEvent: false });
    this.seconds.setValue(0, { emitEvent: false });

    this.hours.valueChanges.pipe(distinctUntilChanged(), debounceTime(UPDATE_DEBOUNCE_TIME)).subscribe(() => this.updateSecondsToLog());
    this.minutes.valueChanges.pipe(distinctUntilChanged(), debounceTime(UPDATE_DEBOUNCE_TIME)).subscribe(() => this.updateSecondsToLog());
    this.seconds.valueChanges.pipe(distinctUntilChanged(), debounceTime(UPDATE_DEBOUNCE_TIME)).subscribe(() => this.updateSecondsToLog());
  }

  ngOnDestroy() {
    this.stopUpdatingSecondsPlayed();
  }

  disableInputs() {
    this.hours.disable();
    this.minutes.disable();
    this.seconds.disable();
  }

  enableInputs() {
    this.hours.enable();
    this.minutes.enable();
    this.seconds.enable();
  }

  startPlaying() {
    this.listService.startPlaying(this.listGame);
    this.playing = true;
    this.startTime = new Date();
    this.listGame.startedPlayingAt = this.startTime.toString();
    this.startUpdatingSecondsPlayed();
  }

  stopPlaying() {
    this.listService.stopPlaying$(this.listGame)
      .subscribe(secondsPlayed => {
        this.listGame.secondsPlayed = secondsPlayed;
      });
    this.playing = false;
    this.listGame.startedPlayingAt = undefined;
    this.stopUpdatingSecondsPlayed();
  }

  cancelPlaying() {
    this.listService.cancelPlaying$(this.listGame)
      .subscribe(() => {
        this.playing = false;
        this.stopUpdatingSecondsPlayed();
        this.secondsPlayed = this.listGame.secondsPlayed;
      });
  }

  startUpdatingSecondsPlayed() {
    this.playTimeUpdateInterval = setInterval(() => {
      this.secondsPlayed =  Math.floor(((new Date()).getTime() - this.startTime.getTime()) / 1000);
    }, SECONDS_PLAYED_UPDATE_INTERVAL);
  }

  stopUpdatingSecondsPlayed() {
    clearInterval(this.playTimeUpdateInterval);
  }

  updateSecondsToLog() {
    const seconds = this.hours.value * SECONDS_IN_HOUR + this.minutes.value * SECONDS_IN_MINUTE + this.seconds.value;

    this.secondsToLog = seconds;
  }

  logTime() {
    this.listService.logTime(this.listGame, this.secondsToLog);
    this.secondsToLog = null;
  }

  cancelLoggingTime() {
    this.secondsToLog = null;
  }
}
