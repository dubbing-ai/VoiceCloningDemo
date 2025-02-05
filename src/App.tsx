import React, { useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Play, Pause, Info } from 'lucide-react';

interface TTSData {
  speakerId: string;
  originalText: string;
  originalSpeech: string;
  generatedSpeech: string;
  generateText: string;
  generatedSpeechNew: string;
}

interface AudioPlayerProps {
  src: string;
  label?: string;
}

interface ColumnHeaderProps {
  title: string;
  description: string;
}

interface TTSSectionProps {
  title: string;
  data: TTSData[];
}

interface ModelSectionProps {
  title: string;
  trainData: TTSData[];
  testData: TTSData[];
}

const columnDescriptions = {
  speaker: 'Unique identifier for each speaker in the dataset',
  originalText: 'Transcription of the original recorded speech',
  originalSpeech: 'Original audio recording from the speaker',
  generatedSpeech:
    'Speech generated using the original text, with the original speech as voice reference input',
  generateText: 'New text input for speech synthesis',
  generatedSpeechNew:
    'Speech generated using the new text, with the original speech as voice reference input',
} as const;

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, label }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(new Audio(src));

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);

    // Reset playing state when audio ends
    audioRef.current.onended = () => setIsPlaying(false);
  };

  return (
    <div className="flex items-center justify-center gap-2 group">
      <button
        onClick={handlePlayPause}
        className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors duration-200 group-hover:shadow-sm">
        {isPlaying ? (
          <Pause className="w-4 h-4 text-blue-600" />
        ) : (
          <Play className="w-4 h-4 text-blue-600" />
        )}
      </button>
      <div className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
        {label}
      </div>
    </div>
  );
};

const ColumnHeader: React.FC<ColumnHeaderProps> = ({ title, description }) => (
  <Tooltip delayDuration={0}>
    <TooltipTrigger className="flex items-center gap-1 cursor-help">
      {title}
      <Info className="w-4 h-4 text-gray-400" />
    </TooltipTrigger>
    <TooltipContent
      side="top"
      className="bg-white p-2 shadow-lg rounded-lg border text-black">
      <p className="max-w-xs text-sm">{description}</p>
    </TooltipContent>
  </Tooltip>
);

const TTSSection: React.FC<TTSSectionProps> = ({ title, data }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-center gap-2">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <div className="text-sm text-gray-500">({data.length} samples)</div>
    </div>
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-left">
              <ColumnHeader
                title="Speaker"
                description={columnDescriptions.speaker}
              />
            </TableHead>
            <TableHead className="font-semibold text-left">
              <ColumnHeader
                title="Original Text"
                description={columnDescriptions.originalText}
              />
            </TableHead>
            <TableHead className="font-semibold text-left">
              <ColumnHeader
                title="Original Speech"
                description={columnDescriptions.originalSpeech}
              />
            </TableHead>
            <TableHead className="font-semibold text-left">
              <ColumnHeader
                title="Generated Speech"
                description={columnDescriptions.generatedSpeech}
              />
            </TableHead>
            <TableHead className="font-semibold text-left">
              <ColumnHeader
                title="Generate Text"
                description={columnDescriptions.generateText}
              />
            </TableHead>
            <TableHead className="font-semibold text-left">
              <ColumnHeader
                title="Generated Speech (New)"
                description={columnDescriptions.generatedSpeechNew}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow
              key={idx}
              className="hover:bg-gray-50 transition-colors duration-200">
              <TableCell className="w-32 font-medium text-left">
                {row.speakerId}
              </TableCell>
              <TableCell className="max-w-64">
                <div className="text-sm text-gray-600 text-left">
                  {row.originalText}
                </div>
              </TableCell>
              <TableCell>
                <AudioPlayer src={row.originalSpeech} label="Original" />
              </TableCell>
              <TableCell>
                <AudioPlayer src={row.generatedSpeech} label="Generated" />
              </TableCell>
              <TableCell className="max-w-64">
                <div className="text-sm text-gray-600 text-left">
                  {row.generateText}
                </div>
              </TableCell>
              <TableCell>
                <AudioPlayer
                  src={row.generatedSpeechNew}
                  label="New Generated"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

const ModelSection: React.FC<ModelSectionProps> = ({
  title,
  trainData,
  testData,
}) => (
  <Card className="mb-8 border-0 w-full shadow-lg mx-auto max-w-7xl">
    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg text-center">
      <CardTitle className="text-xl text-blue-800">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-8 p-6">
      <TTSSection title="Train (seen data)" data={trainData} />
      <TTSSection title="Test (unseen data)" data={testData} />
    </CardContent>
  </Card>
);

const TTSPage: React.FC = () => {
  const experiment0_train: TTSData[] = [
    {
      speakerId: 'tsync2_0_728',
      originalText: 'วัตถุระเบิดสารพิษและสารติดเชื้อวัตถุกัมมันตรังสีก๊าซ',
      originalSpeech: './wav/experiment0/tsync2_0_728/ref.wav',
      generatedSpeech: './wav/experiment0/tsync2_0_728/out1.wav',
      generateText: 'ทดสอบการอ่านออกเสียงภาษาไทย',
      generatedSpeechNew: './wav/experiment0/tsync2_0_728/out2.wav',
    },
    {
      speakerId: 'tsync2_55_3643',
      originalText:
        'และทูลแบบติดตลกว่าเรือใครใครทำซึ่งพระบาทสมเด็จพระเจ้าอยู่หัวก็ทรงทำได้อย่างมีพรสวรรค์',
      originalSpeech: './wav/experiment0/tsync2_55_3643/ref.wav',
      generatedSpeech: './wav/experiment0/tsync2_55_3643/out1.wav',
      generateText: 'ทดสอบการอ่านออกเสียงภาษาไทย',
      generatedSpeechNew: './wav/experiment0/tsync2_55_3643/out2.wav',
    },
  ];

  const experiment0_test: TTSData[] = [
    {
      speakerId: 'jinny',
      originalText: 'คุณช่วยแนะนำร้านอาหารอร่อยๆ หน่อยได้ไหมคะ',
      originalSpeech: './wav/experiment0/jinny/ref.wav',
      generatedSpeech: './wav/experiment0/jinny/out1.wav',
      generateText: 'ทดสอบการอ่านออกเสียงภาษาไทย',
      generatedSpeechNew: './wav/experiment0/jinny/out2.wav',
    },
    {
      speakerId: 'ming',
      originalText: 'ผมประทับใจกับความเป็นมิตรของคนไทยมากครับ',
      originalSpeech: './wav/experiment0/ming/ref.wav',
      generatedSpeech: './wav/experiment0/ming/out1.wav',
      generateText: 'ทดสอบการอ่านออกเสียงภาษาไทย',
      generatedSpeechNew: './wav/experiment0/ming/out2.wav',
    },
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center">
        <div className="w-full max-w-7xl py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            TTS Experiment Results
          </h1>
          <div className="space-y-8 flex flex-col px-2 items-center">
            <ModelSection
              title="KhongKhunTTS (YourTTS on TSync2 only)"
              trainData={experiment0_train}
              testData={experiment0_test}
            />
            {/* <ModelSection title="VoiceCraft" trainData={sampleData} testData={sampleData} /> */}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TTSPage;
