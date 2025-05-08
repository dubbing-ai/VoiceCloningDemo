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
        className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors duration-200 group-hover:shadow-sm"
      >
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
      className="bg-white p-2 shadow-lg rounded-lg border text-black"
    >
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
              className="hover:bg-gray-50 transition-colors duration-200"
            >
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
                {row.generatedSpeech && (
                  <AudioPlayer src={row.generatedSpeech} label="Generated" />
                )}
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

  const experiment1_train: TTSData[] = [
    {
      speakerId: 'cv030_066_mic1',
      originalText: 'ตอนนี้เพื่อนไปเที่ยวโตเกียว',
      originalSpeech: './wav/experiment1/cv030_066_mic1/ref.wav',
      generatedSpeech: './wav/experiment1/cv030_066_mic1/out1.wav',
      generateText: 'ทดสอบการอ่านออกเสียงภาษาไทย',
      generatedSpeechNew: './wav/experiment1/cv030_066_mic1/out2.wav',
    },
    {
      speakerId: 'cv112_112_mic1',
      originalText: 'เครื่องเทศที่หายาก มาจากตะวันออกไกล',
      originalSpeech: './wav/experiment1/cv112_112_mic1/ref.wav',
      generatedSpeech: './wav/experiment1/cv112_112_mic1/out1.wav',
      generateText: 'ทดสอบการอ่านออกเสียงภาษาไทย',
      generatedSpeechNew: './wav/experiment1/cv112_112_mic1/out2.wav',
    },
  ];

  const experiment1_test: TTSData[] = [
    {
      speakerId: 'ekapol_cut',
      originalText: 'แมวคือเท่าไหร่ เป็นหมาคือเท่าไหร่ เป็นหนูคือเท่าไหร่',
      originalSpeech: './wav/experiment1/ekapol_cut/ref.wav',
      generatedSpeech: './wav/experiment1/ekapol_cut/out1.wav',
      generateText: 'ทดสอบการอ่านออกเสียงภาษาไทย',
      generatedSpeechNew: './wav/experiment1/ekapol_cut/out2.wav',
    },
    {
      speakerId: 'ming_long_voice_cut',
      originalText:
        'ถ้าเราต้องการประสบความสำเร็จ เราควรตั้งเป้าหมายและพยายามอย่างเต็มที่ เพื่อให้ไปถึง',
      originalSpeech: './wav/experiment1/ming_long_voice_cut/ref.wav',
      generatedSpeech: './wav/experiment1/ming_long_voice_cut/out1.wav',
      generateText: 'ทดสอบการอ่านออกเสียงภาษาไทย',
      generatedSpeechNew: './wav/experiment1/ming_long_voice_cut/out2.wav',
    },

    {
      speakerId: 'Jinny-all-th',
      originalText: 'คุณช่วยแนะนำร้านอาหารอร่อยๆ หน่อยได้ไหมคะ',
      originalSpeech: './wav/experiment1/Jinny-all-th/ref.wav',
      generatedSpeech: './wav/experiment1/Jinny-all-th/out1.wav',
      generateText: 'ทดสอบการอ่านออกเสียงภาษาไทย',
      generatedSpeechNew: './wav/experiment1/Jinny-all-th/out2.wav',
    },
  ];

  const experiment2_train: TTSData[] = [
    {
      speakerId: 'cv044',
      originalText:
        'กล้องซีซีทีวีปลอม ต่อสัมปทานบีทีเอสสามสิบปี ล้อมรั้วปิดสนามหลวง',
      originalSpeech: './wav/experiment2/cv044/ref.wav',
      generatedSpeech: './wav/experiment2/cv044/out1.wav',
      generateText:
        'การ์ตูนหุ่นยนต์กลายเป็นลักษณะเด่นของการ์ตูนญี่ปุ่นอย่างไรก็ตามไม่ใช่การ์ตูนญี่ปุ่นทุกเรื่องจะเป็นการ์ตูนหุ่นยนต์',
      generatedSpeechNew: './wav/experiment2/cv044/out2.wav',
    },
    {
      speakerId: 'cv062',
      originalText:
        'ฉันทำสิ่งนี้เพื่อป้องกันการขี่จักรยานและกระตุ้นให้เกิดการเคลื่อนไหวมากขึ้นผ่านพื้นที่ทางออก',
      originalSpeech: './wav/experiment2/cv062/ref.wav',
      generatedSpeech: './wav/experiment2/cv062/out1.wav',
      generateText:
        'นายกรัฐมนตรีขอเชิญชวนพุทธศาสนิกชนทุกคนร่วมงานสัปดาห์ส่งเสริมพระพุทธศาสนาเนื่องในเทศกาลวิสาขบูชา',
      generatedSpeechNew: './wav/experiment2/cv062/out2.wav',
    },
  ];

  const experiment2_test: TTSData[] = [
    {
      speakerId: 'speaker-008',
      originalText:
        'แต่กาฬโรคในยุคมืดที่แพร่ไวดังไฟป่า น่าจะติดต่อโดยตรงจากคนหนึ่งสู่อีกคนหนึ่งมากกว่า',
      originalSpeech: './wav/experiment2/speaker-008/ref.wav',
      generatedSpeech: './wav/experiment2/speaker-008/out1.wav',
      generateText:
        'หนึ่งในสิ่งที่น่าประหลาดใจและน่าฉงน เกี่ยวกับกาฬโรคก็คือ ความเจ็บป่วยนี้ ไม่ได้เป็นเหตุการณ์ใหม่เลย แต่เป็นสิ่งที่กระทบต่อมนุษย์มาหลายศตวรรษ',
      generatedSpeechNew: './wav/experiment2/speaker-008/out2.wav',
    },
    {
      speakerId: 'speaker-009',
      originalText:
        'ไม่ใช่เครื่องจักรด้วยซ้ำ แต่เป็นสิ่งมีชีวิตขนาดเล็กที่แปลคลื่นสมองและสัญญาณประสาท ของสัตว์ที่มีความรู้สึกนึกคิดผ่านโทรจิต',
      originalSpeech: './wav/experiment2/speaker-009/ref.wav',
      generatedSpeech: './wav/experiment2/speaker-009/out1.wav',
      generateText:
        'โปรแกรมการแปลแบบอิงกฎใช้ฐานข้อมูลศัพท์ ซึ่งรวมคำทั้งหมดที่พบได้ในพจนานุกรม',
      generatedSpeechNew: './wav/experiment2/speaker-009/out2.wav',
    },

    {
      speakerId: 'speaker-010',
      originalText:
        'ที่เราสามารถบอกได้ก็คือ การแก่ชราเกิดขึ้นเมื่อกระบวนการตามธรรมชาติ และปฏิสัมพันธ์ต่อสิ่งแวดล้อม',
      originalSpeech: './wav/experiment2/speaker-010/ref.wav',
      generatedSpeech: './wav/experiment2/speaker-010/out1.wav',
      generateText:
        'Organelle ที่เรียกว่า Mitochondria มีแนวโน้มที่จะได้รับความเสียหายนี้เป็นพิเศษ',
      generatedSpeechNew: './wav/experiment2/speaker-010/out2.wav',
    },
    {
      speakerId: 'speaker-021',
      originalText:
        'เราทำเพื่องาน แต่ในเวลาเดียวกันเราก็ทำเพื่อร่างกายเราเหมือนกัน เพื่อสุขภาพของเรา โอเค ถ้าเกิดสมมุติว่า ผม อยากจะ',
      originalSpeech: './wav/experiment2/speaker-021/ref.wav',
      generatedSpeech: './wav/experiment2/speaker-021/out1.wav',
      generateText:
        'In World War Two, I play a spy. I go investigate, you know, about a house.',
      generatedSpeechNew: './wav/experiment2/speaker-021/out2.wav',
    },
    {
      speakerId: 'speaker-024',
      originalText:
        "Do I know these people? Like why do they know so much about me? Like how could they say such things about me even though they don't know me?",
      originalSpeech: './wav/experiment2/speaker-024/ref.wav',
      generatedSpeech: './wav/experiment2/speaker-024/out1.wav',
      generateText:
        'หนูคิดว่า เรียกแบบนั้นก็ได้นะคะเพราะว่าเหมือน เริ่มจะมารู้ตอนที่แบบ เวลามีเรียน elective ที่โรงเรียน',
      generatedSpeechNew: './wav/experiment2/speaker-024/out2.wav',
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
            <ModelSection
              title="KhongKhunTTS (YourTTS on TSync2 and CommonVoice)"
              trainData={experiment1_train}
              testData={experiment1_test}
            />
            <ModelSection
              title="KhongKhunTTS (YourTTS on LJSpeech + TSync2 and VCTK + CommonVoice + VTC)"
              trainData={experiment2_train}
              testData={experiment2_test}
            />
            {/* <ModelSection title="VoiceCraft" trainData={sampleData} testData={sampleData} /> */}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TTSPage;
