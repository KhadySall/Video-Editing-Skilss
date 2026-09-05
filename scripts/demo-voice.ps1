$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
Add-Type -ReferencedAssemblies System.Speech -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Speech.Synthesis;
public class DemoSpeech {
  public class Word {
    public string text;
    public double startMs;
    public int character;
  }
  public static List<Word> Render(string text, string path) {
    var words = new List<Word>();
    using (var synth = new SpeechSynthesizer()) {
      synth.SelectVoiceByHints(VoiceGender.Female, VoiceAge.Adult, 0, new System.Globalization.CultureInfo("en-US"));
      synth.Rate = 0;
      synth.SpeakProgress += (sender, e) => words.Add(new Word {
        text = text.Substring(e.CharacterPosition, e.CharacterCount),
        startMs = e.AudioPosition.TotalMilliseconds, character = e.CharacterPosition
      });
      synth.SetOutputToWaveFile(path);
      synth.Speak(text);
    }
    return words;
  }
}
'@
$lines = @('A CV has no universal score.', 'The match changes with the job.', 'Tailor your evidence to the role.')
for ($i = 0; $i -lt $lines.Count; $i++) {
  $target = Join-Path (Get-Location) "public/demo/line-$i.wav"
  if (Test-Path -LiteralPath $target) { throw "Fixture already exists: $target" }
  $words = [DemoSpeech]::Render($lines[$i], $target)
  ConvertTo-Json -InputObject @($words) -Depth 4 | Set-Content -Encoding UTF8 "public/demo/line-$i.json"
}
