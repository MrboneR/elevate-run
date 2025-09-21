-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  age INTEGER,
  weight_kg DECIMAL(5,2),
  height_cm INTEGER,
  running_experience TEXT CHECK (running_experience IN ('beginner', 'intermediate', 'advanced', 'elite')),
  weekly_mileage_goal INTEGER,
  race_goal TEXT,
  preferred_coach_style TEXT CHECK (preferred_coach_style IN ('supportive', 'motivational', 'analytical', 'tough')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create training plans table
CREATE TABLE public.training_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  goal TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  weekly_mileage INTEGER,
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'moderate', 'hard', 'expert')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workouts table
CREATE TABLE public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  training_plan_id UUID REFERENCES public.training_plans(id) ON DELETE CASCADE,
  workout_type TEXT NOT NULL CHECK (workout_type IN ('easy_run', 'tempo_run', 'interval', 'long_run', 'recovery', 'strength', 'cross_training')),
  planned_date DATE NOT NULL,
  planned_distance_km DECIMAL(6,2),
  planned_duration_minutes INTEGER,
  planned_pace_per_km TIME,
  completed_at TIMESTAMP WITH TIME ZONE,
  actual_distance_km DECIMAL(6,2),
  actual_duration_minutes INTEGER,
  actual_pace_per_km TIME,
  effort_level INTEGER CHECK (effort_level >= 1 AND effort_level <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wearable data table
CREATE TABLE public.wearable_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('garmin', 'apple_watch', 'whoop', 'oura', 'polar', 'fitbit')),
  data_type TEXT NOT NULL CHECK (data_type IN ('heart_rate', 'sleep', 'hrv', 'stress', 'recovery', 'steps', 'calories')),
  value DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Create recovery metrics table
CREATE TABLE public.recovery_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  recovery_score INTEGER CHECK (recovery_score >= 0 AND recovery_score <= 100),
  hrv_score DECIMAL(5,2),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  sleep_duration_hours DECIMAL(4,2),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wearable_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for training plans
CREATE POLICY "Users can manage their own training plans" 
  ON public.training_plans FOR ALL 
  USING (auth.uid() = user_id);

-- Create RLS policies for workouts
CREATE POLICY "Users can manage their own workouts" 
  ON public.workouts FOR ALL 
  USING (auth.uid() = user_id);

-- Create RLS policies for wearable data
CREATE POLICY "Users can manage their own wearable data" 
  ON public.wearable_data FOR ALL 
  USING (auth.uid() = user_id);

-- Create RLS policies for recovery metrics
CREATE POLICY "Users can manage their own recovery metrics" 
  ON public.recovery_metrics FOR ALL 
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_plans_updated_at
  BEFORE UPDATE ON public.training_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at
  BEFORE UPDATE ON public.workouts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();